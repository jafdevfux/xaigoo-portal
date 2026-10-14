<?php

// SPDX-License-Identifier: MIT
// Xaigoo Pipeline — API router único
// Convenção: banco em snake_case, API expõe camelCase (conversão no PHP via rowToCamel).
// Documentação: todos os endpoints retornam JSON camelCase compatível com src/data/operationalData.ts

declare(strict_types=1);

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/helpers.php';

// CORS + preflight — antes de qualquer output
enableCors();

require_once __DIR__ . '/auth.php';

// Garante Content-Type JSON em todas as respostas (mesmo em erros não tratados)
header('Content-Type: application/json; charset=utf-8');

// ---------------------------------------------------------------------------
// Constantes de validação (extraídas de src/data/operationalData.ts)
// ---------------------------------------------------------------------------
const INFLUENCER_PLATFORMS = ['Instagram', 'Grupo de Facebook', 'YouTube', 'TikTok'];
const INFLUENCER_STATUSES = [
    'A pesquisar',
    'Selecionado',
    'Primeiro contato enviado',
    'Aguardando resposta',
    'Autorizou o envio',
    'Material enviado',
    'Em avaliação',
    'Parceria aprovada',
    'Em execução',
    'Encerrado',
    'Não interessado',
    'Sem resposta após acompanhamento',
];
const INFLUENCER_RESPONSES = [
    'Pendente',
    'Positiva (Autorizou)',
    'Com dúvidas',
    'Recusou',
    'Sem resposta',
];
const KPI_STAGES = [
    'Volume de Atividade (Esforço)',
    'Conversão do Funil de Parcerias',
    'Resultado Real de Negócio (Atribuição)',
];
const PENDING_CATEGORIES = [
    'Estratégia & Produto',
    'Regras Comerciais & Afiliados',
    'Operação & Responsabilidades',
    'Tecnologia & Metas',
];
const PENDING_VALIDATION_STATUSES = [
    'Pendente de validação',
    'Em revisão pela gestão',
    'Validado internamente',
];

// Mapeamento camelCase (frontend) -> snake_case (banco) para influencers
const INFLUENCER_FIELD_MAP = [
    'nameOrHandle'     => 'name_or_handle',
    'platform'         => 'platform',
    'link'             => 'link',
    'audienceType'     => 'audience_type',
    'justification'    => 'justification',
    'firstContactDate' => 'first_contact_date',
    'status'           => 'status',
    'responseReceived' => 'response_received',
    'proposalSent'     => 'proposal_sent',
    'videosSent'       => 'videos_sent',
    'nextAction'       => 'next_action',
    'notes'            => 'notes',
];

// Fallback estático para flow-stages (espelha STEP1_FLOW_STAGES) quando tabela não existir
const FALLBACK_FLOW_STAGES = [
    ['stepNumber' => '01', 'title' => 'Mapeamento de influenciadores e comunidades', 'owner' => 'Marketing', 'objective' => 'Identificar criadores de conteúdo no Instagram e grupos de Facebook que dialogam diretamente com motoristas de aplicativos.', 'action' => 'Utilizar a listagem inicial já separada pela empresa e expandir a pesquisa manual de perfis do nicho de mobilidade.', 'advanceCondition' => 'Perfil localizado com link ativo e temática compatível com motoristas de app.'],
    ['stepNumber' => '02', 'title' => 'Priorização dos contatos', 'owner' => 'Marketing', 'objective' => 'Classificar e ordenar os perfis mapeados pelos 7 critérios manuais de qualificação sem uso de ferramentas pagas.', 'action' => 'Avaliar engajamento real, adequação à imagem da marca, coerência do conteúdo e disponibilidade de canal de contato.', 'advanceCondition' => 'Ficha do influenciador preenchida com status "Selecionado" e justificativa clara para abordagem.'],
    ['stepNumber' => '03', 'title' => 'Primeiro contato pelo Direct', 'owner' => 'Conjunto (Mkt + Vendas)', 'objective' => 'Iniciar conversa de forma humana, curta e respeitosa, apresentando brevemente o Xaigoo sem parecer spam.', 'action' => 'Enviar a mensagem inicial personalizada no Direct do Instagram (ou canal principal), perguntando apenas se aceita receber a proposta.', 'advanceCondition' => 'Mensagem enviada e data do primeiro contato devidamente registrada na ficha de controle.', 'warningNote' => 'Jamais enviar links longos, regras de comissão ou vídeos no primeiro contato sem permissão.'],
    ['stepNumber' => '04', 'title' => 'Permissão para enviar a proposta', 'owner' => 'Vendas & Parcerias', 'objective' => 'Obter o consentimento explícito do influenciador antes de encaminhar qualquer material comercial.', 'action' => 'Monitorar a caixa de entrada. Se não houver resposta, realizar acompanhamento respeitoso e limitado. Se recusar, agradecer e encerrar.', 'advanceCondition' => 'Influenciador respondeu positivamente autorizando o envio do material (Status: "Autorizou o envio").', 'warningNote' => 'Nunca trate o silêncio como autorização para enviar materiais repetidamente.'],
    ['stepNumber' => '05', 'title' => 'Envio do material aprovado', 'owner' => 'Vendas & Parcerias', 'objective' => 'Apresentar a visão geral da parceria com clareza executiva por meio do documento oficial aprovado pela empresa.', 'action' => 'Encaminhar o material de proposta oficial e perguntar se o formato faz sentido para o perfil dele.', 'advanceCondition' => 'Material entregue, registrado na ficha ("Proposta enviada: Sim") e leitura/interesse sinalizado pelo parceiro.'],
    ['stepNumber' => '06', 'title' => 'Envio dos dois vídeos explicativos (~1 minuto)', 'owner' => 'Vendas & Parcerias', 'objective' => 'Explicar de forma visual e separada os dois modelos de ganho disponíveis, somente após o influenciador demonstrar interesse na proposta.', 'action' => 'Enviar o Vídeo 1 (Bônus de Indicação Direta do PRO - 20% único) e o Vídeo 2 (Programa de Afiliados PRO X-AI).', 'advanceCondition' => 'Interesse prévio confirmado pelo influenciador e ambos os vídeos encaminhados na conversa.', 'warningNote' => 'Os dois vídeos nunca devem misturar as regras da indicação direta com o programa PRO X-AI.'],
    ['stepNumber' => '07', 'title' => 'Esclarecimento de dúvidas', 'owner' => 'Vendas & Parcerias', 'objective' => 'Responder com precisão técnica e transparência a todas as perguntas sobre o Xaigoo Copilot e os modelos de parceria.', 'action' => 'Consultar as regras oficiais confirmadas. Caso surja dúvida sobre item não documentado, alinhar com a gestão antes de responder.', 'advanceCondition' => 'Dúvidas sanadas sem promessas de renda garantida ou percentuais não verificados.'],
    ['stepNumber' => '08', 'title' => 'Avaliação da parceria', 'owner' => 'Conjunto (Mkt + Vendas)', 'objective' => 'Permitir que tanto o influenciador quanto a equipe Xaigoo avaliem se há aderência para avançar à execução.', 'action' => 'Analisar o interesse do parceiro, o formato de divulgação proposto (Stories, Reels, menção em grupo) e as condições autorizadas.', 'advanceCondition' => 'Ambas as partes de acordo com o modelo de atuação (Status: "Parceria aprovada").'],
    ['stepNumber' => '09', 'title' => 'Formalização e alinhamento da divulgação', 'owner' => 'Vendas & Parcerias', 'objective' => 'Deixar claro o escopo da divulgação, links/códigos de atribuição, regras de bonificação e cronograma de postagem.', 'action' => 'Confirmar por escrito o que será divulgado, fornecer o código/link correto e alinhar diretrizes de comunicação da marca.', 'advanceCondition' => 'Escopo formalizado, código de rastreamento entregue e data prevista de publicação alinhada.'],
    ['stepNumber' => '10', 'title' => 'Publicação ou ação acordada', 'owner' => 'Marketing', 'objective' => 'Garantir que a divulgação do Xaigoo Copilot ocorra conforme o alinhamento e respeitando a linguagem oficial.', 'action' => 'Acompanhar a postagem em tempo real, verificar se o código/link está funcional e interagir institucionalmente se aplicável.', 'advanceCondition' => 'Conteúdo publicado e ativo para a audiência de motoristas (Status: "Em execução").'],
    ['stepNumber' => '11', 'title' => 'Acompanhamento de resultados', 'owner' => 'Conjunto (Mkt + Vendas)', 'objective' => 'Mensurar o impacto real da ação separando métricas de vaidade (visualizações) de resultados concretos (downloads e ativações).', 'action' => 'Rastrear cliques, acessos, downloads atribuíveis, cadastros no Xaigoo Copilot e eventuais conversões para planos pagos.', 'advanceCondition' => 'Dados da campanha consolidados no painel de indicadores do STEP 1.'],
    ['stepNumber' => '12', 'title' => 'Registro de aprendizados', 'owner' => 'Conjunto (Mkt + Vendas)', 'objective' => 'Transformar cada abordagem e campanha em inteligência prática para otimizar os próximos contatos.', 'action' => 'Documentar objeções, perguntas frequentes dos motoristas, melhores formatos de mensagem e qualidade do público atraído.', 'advanceCondition' => 'Feedback compartilhado entre Marketing e Vendas para ajuste contínuo do processo.'],
];

// ---------------------------------------------------------------------------
// Helpers locais
// ---------------------------------------------------------------------------

/**
 * Normaliza input: aceita tanto camelCase quanto snake_case, prioriza camelCase.
 *
 * @param array<string,mixed> $input
 * @param array<string,string> $map camelCase => snake_case
 * @return array<string,mixed> snake_case => value
 */
function normalizeToSnake(array $input, array $map): array
{
    $out = [];
    foreach ($map as $camel => $snake) {
        if (array_key_exists($camel, $input)) {
            $out[$snake] = $input[$camel];
        } elseif (array_key_exists($snake, $input)) {
            $out[$snake] = $input[$snake];
        }
    }
    // id pode vir em ambos formatos
    if (isset($input['id'])) {
        $out['id'] = $input['id'];
    }
    return $out;
}

/**
 * Valida enum; retorna erro 400 se inválido.
 */
function assertEnum(mixed $value, array $allowed, string $field): void
{
    if ($value === null || $value === '') {
        return;
    }
    if (!in_array($value, $allowed, true)) {
        errorResponse("Campo '{$field}' inválido. Permitidos: " . implode(', ', $allowed), 422);
    }
}

// ---------------------------------------------------------------------------
// Roteamento — Auth (sessão PHP) — antes das demais rotas para não colidir
// ---------------------------------------------------------------------------
$segments = getPathSegments();
$method = strtoupper($_SERVER['REQUEST_METHOD'] ?? 'GET');

// Auth: POST /api/auth/register | POST /api/auth/login | GET /api/auth/me | POST /api/auth/logout
// Middleware futuro pode proteger outras rotas; por enquanto apenas auth exige sessão.
if (($segments[0] ?? null) === 'auth') {
    $action = $segments[1] ?? null;

    if ($action === 'register') {
        handleAuthRegister();
    }
    if ($action === 'login') {
        handleAuthLogin();
    }
    if ($action === 'me') {
        handleAuthMe();
    }
    if ($action === 'logout') {
        handleAuthLogout();
    }

    errorResponse('Not Found', 404);
}

// ---------------------------------------------------------------------------
// Rota: GET /api/health  (e também GET /api  como alias)
if ((count($segments) === 1 && $segments[0] === 'health') || count($segments) === 0) {
    requireMethod('GET');
    try {
        $pdo = getPDO();
        $pdo->query('SELECT 1');
        jsonResponse([
            'status' => 'ok',
            'db' => 'connected',
            'time' => date('c'),
        ]);
    } catch (Throwable $e) {
        errorResponse('Database health check failed', 500);
    }
}

// ---------------------------------------------------------------------------
// Influencers — coleção e membro
// ---------------------------------------------------------------------------
if (($segments[0] ?? null) === 'influencers') {
    $id = $segments[1] ?? null;
    $hasId = $id !== null && $id !== '';

    // GET /api/influencers — listagem ORDER BY updated_at DESC
    if (!$hasId && $method === 'GET') {
        try {
            $pdo = getPDO();
            $stmt = $pdo->query(
                'SELECT id, name_or_handle, platform, link, audience_type, justification, ' .
                'first_contact_date, status, response_received, proposal_sent, videos_sent, ' .
                'next_action, notes, created_at, updated_at ' .
                'FROM influencers ORDER BY updated_at DESC, created_at DESC'
            );
            $rows = $stmt->fetchAll();
            $data = array_map('rowToCamel', $rows);
            jsonResponse($data);
        } catch (PDOException $e) {
            // Tabela inexistente → mensagem acionável
            if ($e->getCode() === '42S02') {
                errorResponse('Tabela influencers não existe. Execute o schema SQL no cPanel.', 500);
            }
            errorResponse('Erro ao listar influenciadores', 500);
        }
    }

    // POST /api/influencers — cria (gera id inf-{uniqid} se não enviado)
    if (!$hasId && $method === 'POST') {
        $input = getJsonInput();
        $data = normalizeToSnake($input, INFLUENCER_FIELD_MAP);
        // id especial
        $newId = $data['id'] ?? $input['id'] ?? null;
        if (empty($newId)) {
            $newId = 'inf-' . uniqid();
        }
        $data['id'] = $newId;

        // Validações básicas
        if (empty($data['name_or_handle'])) {
            errorResponse('Campo nameOrHandle é obrigatório', 422);
        }
        if (!empty($data['platform'])) {
            assertEnum($data['platform'], INFLUENCER_PLATFORMS, 'platform');
        }
        if (!empty($data['status'])) {
            assertEnum($data['status'], INFLUENCER_STATUSES, 'status');
        }
        if (!empty($data['response_received'])) {
            assertEnum($data['response_received'], INFLUENCER_RESPONSES, 'responseReceived');
        }
        // Converte booleans para TINYINT
        if (isset($data['proposal_sent'])) {
            $data['proposal_sent'] = $data['proposal_sent'] ? 1 : 0;
        }
        if (isset($data['videos_sent'])) {
            $data['videos_sent'] = $data['videos_sent'] ? 1 : 0;
        }
        // Valida data se enviada
        if (!empty($data['first_contact_date']) && !preg_match('/^\d{4}-\d{2}-\d{2}$/', (string) $data['first_contact_date'])) {
            errorResponse('firstContactDate deve estar no formato YYYY-MM-DD', 422);
        }

        try {
            $pdo = getPDO();
            $pdo->beginTransaction();

            // Verifica duplicidade de id
            $chk = $pdo->prepare('SELECT id FROM influencers WHERE id = :id');
            $chk->execute([':id' => $newId]);
            if ($chk->fetch()) {
                $pdo->rollBack();
                errorResponse('Influenciador com este id já existe', 409);
            }

            $now = date('Y-m-d H:i:s');
            $fields = [
                'id' => $newId,
                'name_or_handle' => $data['name_or_handle'] ?? null,
                'platform' => $data['platform'] ?? null,
                'link' => $data['link'] ?? null,
                'audience_type' => $data['audience_type'] ?? null,
                'justification' => $data['justification'] ?? null,
                'first_contact_date' => $data['first_contact_date'] ?? null,
                'status' => $data['status'] ?? 'A pesquisar',
                'response_received' => $data['response_received'] ?? 'Pendente',
                'proposal_sent' => $data['proposal_sent'] ?? 0,
                'videos_sent' => $data['videos_sent'] ?? 0,
                'next_action' => $data['next_action'] ?? null,
                'notes' => $data['notes'] ?? null,
                'created_at' => $now,
                'updated_at' => $now,
            ];

            $cols = implode(', ', array_keys($fields));
            $placeholders = ':' . implode(', :', array_keys($fields));
            $stmt = $pdo->prepare("INSERT INTO influencers ({$cols}) VALUES ({$placeholders})");
            $stmt->execute($fields);
            $pdo->commit();

            // Retorna registro criado em camelCase
            $sel = $pdo->prepare('SELECT * FROM influencers WHERE id = :id');
            $sel->execute([':id' => $newId]);
            $row = $sel->fetch();
            jsonResponse(rowToCamel($row), 201);
        } catch (PDOException $e) {
            if (isset($pdo) && $pdo->inTransaction()) {
                $pdo->rollBack();
            }
            if ($e->getCode() === '23000') {
                errorResponse('Violação de constraint ao criar influenciador', 409);
            }
            errorResponse('Erro ao criar influenciador', 500);
        }
    }

    // GET /api/influencers/{id}
    if ($hasId && $method === 'GET') {
        try {
            $pdo = getPDO();
            $stmt = $pdo->prepare('SELECT * FROM influencers WHERE id = :id');
            $stmt->execute([':id' => $id]);
            $row = $stmt->fetch();
            if (!$row) {
                errorResponse('Influenciador não encontrado', 404);
            }
            jsonResponse(rowToCamel($row));
        } catch (PDOException $e) {
            errorResponse('Erro ao buscar influenciador', 500);
        }
    }

    // PUT /api/influencers/{id} — atualiza apenas campos enviados
    if ($hasId && $method === 'PUT') {
        $input = getJsonInput();
        if (empty($input)) {
            errorResponse('Body vazio: envie ao menos um campo para atualizar', 400);
        }
        $data = normalizeToSnake($input, INFLUENCER_FIELD_MAP);
        // Nunca permitir trocar id via body
        unset($data['id']);

        if (isset($data['platform'])) {
            assertEnum($data['platform'], INFLUENCER_PLATFORMS, 'platform');
        }
        if (isset($data['status'])) {
            assertEnum($data['status'], INFLUENCER_STATUSES, 'status');
        }
        if (isset($data['response_received'])) {
            assertEnum($data['response_received'], INFLUENCER_RESPONSES, 'responseReceived');
        }
        if (isset($data['proposal_sent'])) {
            $data['proposal_sent'] = $data['proposal_sent'] ? 1 : 0;
        }
        if (isset($data['videos_sent'])) {
            $data['videos_sent'] = $data['videos_sent'] ? 1 : 0;
        }
        if (isset($data['first_contact_date']) && $data['first_contact_date'] !== null && $data['first_contact_date'] !== '') {
            if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', (string) $data['first_contact_date'])) {
                errorResponse('firstContactDate deve estar no formato YYYY-MM-DD', 422);
            }
        }
        // Permite limpar data enviando null ou string vazia
        if (array_key_exists('first_contact_date', $data) && $data['first_contact_date'] === '') {
            $data['first_contact_date'] = null;
        }

        if (empty($data)) {
            errorResponse('Nenhum campo válido para atualização', 422);
        }

        try {
            $pdo = getPDO();
            $pdo->beginTransaction();

            $chk = $pdo->prepare('SELECT id FROM influencers WHERE id = :id');
            $chk->execute([':id' => $id]);
            if (!$chk->fetch()) {
                $pdo->rollBack();
                errorResponse('Influenciador não encontrado', 404);
            }

            $setParts = [];
            $params = [':id' => $id];
            foreach ($data as $col => $val) {
                $setParts[] = "{$col} = :{$col}";
                $params[":{$col}"] = $val;
            }
            $setParts[] = 'updated_at = :updated_at';
            $params[':updated_at'] = date('Y-m-d H:i:s');

            $sql = 'UPDATE influencers SET ' . implode(', ', $setParts) . ' WHERE id = :id';
            $stmt = $pdo->prepare($sql);
            $stmt->execute($params);
            $pdo->commit();

            $sel = $pdo->prepare('SELECT * FROM influencers WHERE id = :id');
            $sel->execute([':id' => $id]);
            $row = $sel->fetch();
            jsonResponse(rowToCamel($row));
        } catch (PDOException $e) {
            if (isset($pdo) && $pdo->inTransaction()) {
                $pdo->rollBack();
            }
            errorResponse('Erro ao atualizar influenciador', 500);
        }
    }

    // DELETE /api/influencers/{id}
    if ($hasId && $method === 'DELETE') {
        try {
            $pdo = getPDO();
            $stmt = $pdo->prepare('DELETE FROM influencers WHERE id = :id');
            $stmt->execute([':id' => $id]);
            if ($stmt->rowCount() === 0) {
                errorResponse('Influenciador não encontrado', 404);
            }
            jsonResponse(['deleted' => true, 'id' => $id]);
        } catch (PDOException $e) {
            errorResponse('Erro ao remover influenciador', 500);
        }
    }

    // Método não permitido para /influencers
    errorResponse('Method Not Allowed', 405);
}

// ---------------------------------------------------------------------------
// KPIs — GET coleção, PUT membro
// ---------------------------------------------------------------------------
if (($segments[0] ?? null) === 'kpis' || ($segments[0] ?? null) === 'kpi-metrics') {
    $kpiId = $segments[1] ?? null;

    // GET /api/kpis — lista todos ORDER BY updated_at DESC (fallback estático se tabela ausente)
    if ($kpiId === null && $method === 'GET') {
        try {
            $pdo = getPDO();
            $stmt = $pdo->query(
                'SELECT id, stage, name, description, current_value, target_goal, measurement_note, created_at, updated_at ' .
                'FROM kpi_metrics ORDER BY updated_at DESC, id ASC'
            );
            $rows = $stmt->fetchAll();
            $data = array_map('rowToCamel', $rows);
            jsonResponse($data);
        } catch (PDOException $e) {
            // Fallback: retorna mock estático se tabela ainda não foi criada (útil no primeiro deploy)
            if ($e->getCode() === '42S02') {
                // Dados espelham INITIAL_KPI_METRICS mas já em camelCase
                $fallback = [
                    ['id' => 'kpi-1', 'stage' => 'Volume de Atividade (Esforço)', 'name' => '1. Influenciadores e comunidades pesquisados', 'description' => 'Total de perfis no Instagram e grupos de Facebook identificados na triagem inicial.', 'currentValue' => '0', 'targetGoal' => 'A definir pela gestão', 'measurementNote' => 'Métrica de atividade de Marketing. Não representa parceria fechada.'],
                    ['id' => 'kpi-2', 'stage' => 'Volume de Atividade (Esforço)', 'name' => '2. Perfis qualificados (Selecionados)', 'description' => 'Perfis que passaram pelos 7 critérios manuais de aderência e segurança de marca.', 'currentValue' => '0', 'targetGoal' => 'A definir pela gestão', 'measurementNote' => 'Garante que o tempo de abordagem seja investido apenas em quem fala com motoristas.'],
                    ['id' => 'kpi-3', 'stage' => 'Volume de Atividade (Esforço)', 'name' => '3. Primeiros contatos enviados', 'description' => 'Mensagens iniciais enviadas no Direct solicitando permissão para apresentar a proposta.', 'currentValue' => '0', 'targetGoal' => 'A definir pela gestão', 'measurementNote' => 'Volume de prospecção ativa respeitando o protocolo sem spam.'],
                    ['id' => 'kpi-4', 'stage' => 'Conversão do Funil de Parcerias', 'name' => '4. Respostas recebidas', 'description' => 'Total de influenciadores que responderam ao contato inicial (positiva, dúvida ou recusa).', 'currentValue' => '0', 'targetGoal' => 'A definir pela gestão', 'measurementNote' => 'Termômetro da qualidade da abordagem inicial no Direct.'],
                    ['id' => 'kpi-5', 'stage' => 'Conversão do Funil de Parcerias', 'name' => '5. Autorizações para envio de proposta', 'description' => 'Contatos que deram permissão explícita para conhecer o material comercial do Xaigoo.', 'currentValue' => '0', 'targetGoal' => 'A definir pela gestão', 'measurementNote' => 'Condição obrigatória para destravar o envio do documento de proposta.'],
                    ['id' => 'kpi-6', 'stage' => 'Conversão do Funil de Parcerias', 'name' => '6. Propostas enviadas', 'description' => 'Materiais oficiais aprovados encaminhados aos influenciadores que autorizaram.', 'currentValue' => '0', 'targetGoal' => 'A definir pela gestão', 'measurementNote' => 'Deve corresponder a 100% dos perfis que concederam autorização.'],
                    ['id' => 'kpi-7', 'stage' => 'Conversão do Funil de Parcerias', 'name' => '7. Vídeos explicativos enviados (Vídeo 1 e Vídeo 2)', 'description' => 'Perfis que demonstraram interesse após a proposta e receberam os 2 vídeos de ~1 minuto.', 'currentValue' => '0', 'targetGoal' => 'A definir pela gestão', 'measurementNote' => 'Indica interesse concreto em entender os modelos de bonificação.'],
                    ['id' => 'kpi-8', 'stage' => 'Conversão do Funil de Parcerias', 'name' => '8. Parcerias aprovadas', 'description' => 'Influenciadores alinhados e formalizados com escopo e código/link de divulgação definidos.', 'currentValue' => '0', 'targetGoal' => 'A definir pela gestão', 'measurementNote' => 'Marco de fechamento do trabalho de Vendas & Parcerias.'],
                    ['id' => 'kpi-9', 'stage' => 'Conversão do Funil de Parcerias', 'name' => '9. Divulgações realizadas', 'description' => 'Publicações, Stories, Reels ou ações em grupos efetivamente colocadas no ar.', 'currentValue' => '0', 'targetGoal' => 'A definir pela gestão', 'measurementNote' => 'Pontapé para geração de tráfego e testes de mensagem com o público.'],
                    ['id' => 'kpi-10', 'stage' => 'Resultado Real de Negócio (Atribuição)', 'name' => '10. Cliques ou acessos rastreáveis', 'description' => 'Visitas às páginas ou lojas de aplicativo originadas por links parametrizados dos parceiros.', 'currentValue' => '0', 'targetGoal' => 'A definir pela gestão', 'measurementNote' => 'Depende de link rastreável (UTM / link de afiliado) validado tecnicamente.'],
                    ['id' => 'kpi-11', 'stage' => 'Resultado Real de Negócio (Atribuição)', 'name' => '11. Downloads atribuíveis às ações', 'description' => 'Instalações do aplicativo Xaigoo Copilot originadas pelas campanhas do STEP 1.', 'currentValue' => '0', 'targetGoal' => 'A definir pela gestão', 'measurementNote' => 'Lembrete: visualizações ou número de seguidores não geram downloads automaticamente.'],
                    ['id' => 'kpi-12', 'stage' => 'Resultado Real de Negócio (Atribuição)', 'name' => '12. Usuários cadastrados ou ativados (quando mensuráveis)', 'description' => 'Motoristas que criaram conta ou utilizaram o código de indicação dentro do Xaigoo Copilot.', 'currentValue' => '0', 'targetGoal' => 'A definir pela gestão', 'measurementNote' => 'Mede a qualidade real da audiência trazida por cada influenciador.'],
                    ['id' => 'kpi-13', 'stage' => 'Resultado Real de Negócio (Atribuição)', 'name' => '13. Conversões para planos pagos (PRO / PRO X-AI)', 'description' => 'Aquisições elegíveis de planos pagos originadas pelos códigos ou links dos parceiros.', 'currentValue' => '0', 'targetGoal' => 'A definir pela gestão', 'measurementNote' => 'Fato gerador das bonificações conforme as regras oficiais de cada programa.'],
                ];
                jsonResponse($fallback);
            }
            errorResponse('Erro ao listar KPIs', 500);
        }
    }

    // PUT /api/kpis/{id} — atualiza métrica (currentValue, targetGoal, etc.)
    if ($kpiId !== null && $method === 'PUT') {
        $input = getJsonInput();
        // Mapeamento KPI: camelCase -> snake_case
        $kpiMap = [
            'stage' => 'stage',
            'name' => 'name',
            'description' => 'description',
            'currentValue' => 'current_value',
            'targetGoal' => 'target_goal',
            'measurementNote' => 'measurement_note',
        ];
        $data = normalizeToSnake($input, $kpiMap);
        unset($data['id']);

        if (isset($data['stage'])) {
            assertEnum($data['stage'], KPI_STAGES, 'stage');
        }
        if (empty($data)) {
            errorResponse('Nenhum campo válido para atualização', 422);
        }

        try {
            $pdo = getPDO();
            $chk = $pdo->prepare('SELECT id FROM kpi_metrics WHERE id = :id');
            $chk->execute([':id' => $kpiId]);
            if (!$chk->fetch()) {
                errorResponse('KPI não encontrado', 404);
            }

            $setParts = [];
            $params = [':id' => $kpiId];
            foreach ($data as $col => $val) {
                $setParts[] = "{$col} = :{$col}";
                $params[":{$col}"] = $val;
            }
            $setParts[] = 'updated_at = :updated_at';
            $params[':updated_at'] = date('Y-m-d H:i:s');

            $sql = 'UPDATE kpi_metrics SET ' . implode(', ', $setParts) . ' WHERE id = :id';
            $stmt = $pdo->prepare($sql);
            $stmt->execute($params);

            $sel = $pdo->prepare('SELECT * FROM kpi_metrics WHERE id = :id');
            $sel->execute([':id' => $kpiId]);
            $row = $sel->fetch();
            jsonResponse(rowToCamel($row));
        } catch (PDOException $e) {
            errorResponse('Erro ao atualizar KPI', 500);
        }
    }

    errorResponse('Method Not Allowed', 405);
}

// ---------------------------------------------------------------------------
// Flow stages — GET apenas (estático ou tabela flow_stages)
// ---------------------------------------------------------------------------
if (($segments[0] ?? null) === 'flow-stages') {
    requireMethod('GET');
    try {
        $pdo = getPDO();
        $stmt = $pdo->query(
            'SELECT step_number, title, owner, objective, action, advance_condition, warning_note ' .
            'FROM flow_stages ORDER BY step_number ASC'
        );
        $rows = $stmt->fetchAll();
        // Se tabela vazia, usa fallback
        if (empty($rows)) {
            jsonResponse(FALLBACK_FLOW_STAGES);
        }
        $data = array_map('rowToCamel', $rows);
        jsonResponse($data);
    } catch (PDOException $e) {
        // Tabela não existe → fallback estático (sempre funciona)
        if ($e->getCode() === '42S02') {
            jsonResponse(FALLBACK_FLOW_STAGES);
        }
        errorResponse('Erro ao listar flow stages', 500);
    }
}

// ---------------------------------------------------------------------------
// Pending items — GET coleção, PUT membro
// ---------------------------------------------------------------------------
if (($segments[0] ?? null) === 'pending-items') {
    $pendId = $segments[1] ?? null;

    // GET /api/pending-items — lista todos ORDER BY updated_at DESC
    if ($pendId === null && $method === 'GET') {
        try {
            $pdo = getPDO();
            $stmt = $pdo->query(
                'SELECT id, topic, category, confirmed_in_briefing_or_site, pending_decision, ' .
                'impact_on_team, validation_status, created_at, updated_at ' .
                'FROM pending_items ORDER BY updated_at DESC, id ASC'
            );
            $rows = $stmt->fetchAll();
            $data = array_map('rowToCamel', $rows);
            jsonResponse($data);
        } catch (PDOException $e) {
            if ($e->getCode() === '42S02') {
                // Fallback espelha INITIAL_PENDING_ITEMS (11 itens) em camelCase
                $fallback = [
                    ['id' => 'pend-1', 'topic' => '1. Nomes e funções oficiais dos quatro Steps (Steps 2, 3 e 4)', 'category' => 'Estratégia & Produto', 'confirmedInBriefingOrSite' => 'O ecossistema possui 4 Steps. O STEP 1 é oficialmente focado no Xaigoo Copilot, captação de parceiros de divulgação e aquisição de usuários.', 'pendingDecision' => 'Confirmar a nomenclatura definitiva, a ordem exata e os marcos de ativação dos Steps 2, 3 e 4.', 'impactOnTeam' => 'Até a confirmação, a equipe deve apresentá-los apenas como pilares de expansão do ecossistema, sem prometer datas.', 'validationStatus' => 'Pendente de validação'],
                    ['id' => 'pend-2', 'topic' => '2. Status operacional detalhado de cada produto e recurso', 'category' => 'Estratégia & Produto', 'confirmedInBriefingOrSite' => 'O Xaigoo Copilot já é apresentado publicamente no site e Google Play com recursos para motoristas. Existe página para PRO X-AI e Insiders.', 'pendingDecision' => 'Distinguir internamente quais recursos de cada plano (Gratuito, PRO, PRO X-AI) e do Xaigoo Ads/Play já estão 100% operacionais em produção hoje.', 'impactOnTeam' => 'Evita confundir a existência de uma página comercial com a disponibilidade imediata de todos os recursos.', 'validationStatus' => 'Pendente de validação'],
                    ['id' => 'pend-3', 'topic' => '3. Regras completas do Programa de Afiliados PRO X-AI', 'category' => 'Regras Comerciais & Afiliados', 'confirmedInBriefingOrSite' => 'Trata-se de um programa distinto da indicação direta do PRO, vinculado ao plano PRO X-AI (/plano-pro-xai), com oportunidades de bonificações recorrentes e rede.', 'pendingDecision' => 'Documentar percentuais exatos, níveis de rede (se aplicável), requisitos de elegibilidade, prazos de saque e políticas de cancelamento.', 'impactOnTeam' => 'Vendas não deve inventar percentuais ou exemplos financeiros antes de receber a tabela validada.', 'validationStatus' => 'Pendente de validação'],
                    ['id' => 'pend-4', 'topic' => '4. Regras e funcionamento do Xaigoo Insiders', 'category' => 'Regras Comerciais & Afiliados', 'confirmedInBriefingOrSite' => 'A página oficial https://www.xaigoo.app/insiders existe e faz parte da Categoria A do portfólio.', 'pendingDecision' => 'Confirmar o escopo oficial do programa Insiders, quem pode ingressar, como difere do PRO X-AI e quais são os benefícios vigentes.', 'impactOnTeam' => 'Manter como "Sujeito à confirmação" durante as abordagens iniciais do STEP 1.', 'validationStatus' => 'Pendente de validação'],
                    ['id' => 'pend-5', 'topic' => '5. Modelo oficial de proposta e aprovação dos 2 vídeos de 1 minuto', 'category' => 'Operação & Responsabilidades', 'confirmedInBriefingOrSite' => 'O fluxo exige enviar primeiro uma proposta aprovada (após permissão) e, havendo interesse, 2 vídeos de ~1 min (Vídeo 1: Indicação PRO 20%; Vídeo 2: Afiliados PRO X-AI).', 'pendingDecision' => 'Disponibilizar o arquivo final da proposta (PDF/link) e os arquivos finais dos Vídeos 1 e 2 revisados pela diretoria.', 'impactOnTeam' => 'Bloqueio operacional direto: os contatos no Direct só devem avançar à etapa de envio com os arquivos oficiais em mãos.', 'validationStatus' => 'Pendente de validação'],
                    ['id' => 'pend-6', 'topic' => '6. Condições comerciais das parcerias com influenciadores', 'category' => 'Regras Comerciais & Afiliados', 'confirmedInBriefingOrSite' => 'A parceria baseia-se nos mecanismos de bonificação (Indicação Direta PRO 20% único e/ou Programa de Afiliados PRO X-AI).', 'pendingDecision' => 'Definir se os influenciadores parceiros receberão acesso cortesia ao plano PRO / PRO X-AI para testar e demonstrar o app aos seguidores, e se há teto ou condição especial.', 'impactOnTeam' => 'Fundamental para responder à pergunta mais comum de criadores de conteúdo durante a negociação.', 'validationStatus' => 'Pendente de validação'],
                    ['id' => 'pend-7', 'topic' => '7. Divisão exata de responsáveis por cada etapa do contato', 'category' => 'Operação & Responsabilidades', 'confirmedInBriefingOrSite' => 'Marketing mapeia, prepara materiais e analisa canais; Vendas qualifica, conduz negociação, apresenta proposta e formaliza.', 'pendingDecision' => 'Decidir nominalmente na liderança quem envia o primeiro Direct e em que momento exato o bastão passa de Marketing para Vendas.', 'impactOnTeam' => 'Evita duplicidade de mensagens para o mesmo influenciador ou contatos esquecidos no Direct.', 'validationStatus' => 'Pendente de validação'],
                    ['id' => 'pend-8', 'topic' => '8. Ferramentas de registro, CRM e acompanhamento', 'category' => 'Tecnologia & Metas', 'confirmedInBriefingOrSite' => 'O processo do STEP 1 foi desenhado para ser executado manualmente e sem depender de ferramentas pagas.', 'pendingDecision' => 'Definir onde a ficha oficial de influenciadores será mantida no dia a dia pela equipe (planilha compartilhada, CRM gratuito ou exportação CSV deste portal).', 'impactOnTeam' => 'Garante fonte única de verdade para o status de cada influenciador.', 'validationStatus' => 'Pendente de validação'],
                    ['id' => 'pend-9', 'topic' => '9. Metas numéricas de divulgação e aquisição do STEP 1', 'category' => 'Tecnologia & Metas', 'confirmedInBriefingOrSite' => 'Os 13 indicadores operacionais já estão estruturados (de influenciadores pesquisados até conversões em planos pagos).', 'pendingDecision' => 'Estabelecer as metas semanais/mensais de prospecção, parcerias aprovadas e downloads esperados.', 'impactOnTeam' => 'Permite calibrar o ritmo diário de envios de Direct e acompanhamento.', 'validationStatus' => 'Pendente de validação'],
                    ['id' => 'pend-10', 'topic' => '10. Mecanismos técnicos de rastreamento e atribuição de usuários', 'category' => 'Tecnologia & Metas', 'confirmedInBriefingOrSite' => 'A atribuição deve ocorrer por meio de códigos de indicação, links parametrizados ou mecanismos disponíveis no app.', 'pendingDecision' => 'Validar com a equipe técnica como o código de cada influenciador será gerado e como os relatórios de downloads/ativações serão extraídos.', 'impactOnTeam' => 'Indispensável para apurar resultados reais e calcular bonificações com exatidão.', 'validationStatus' => 'Pendente de validação'],
                    ['id' => 'pend-11', 'topic' => '11. Regras para pagamentos, bonificações, revenue share e formalização', 'category' => 'Regras Comerciais & Afiliados', 'confirmedInBriefingOrSite' => 'Bônus de Indicação Direta do PRO é de 20% único na 1ª aquisição (mensal, trimestral ou anual). Estabelecimentos e parceiros URBAN/VENUE possuem modelos próprios.', 'pendingDecision' => 'Confirmar prazo de liberação do crédito, forma de resgate/pagamento, retenções fiscais e termo de adesão/formalização do parceiro.', 'impactOnTeam' => 'Garante segurança jurídica e transparência total no fechamento da parceria.', 'validationStatus' => 'Pendente de validação'],
                ];
                jsonResponse($fallback);
            }
            errorResponse('Erro ao listar pending items', 500);
        }
    }

    // PUT /api/pending-items/{id} — atualiza item de governança
    if ($pendId !== null && $method === 'PUT') {
        $input = getJsonInput();
        $pendMap = [
            'topic' => 'topic',
            'category' => 'category',
            'confirmedInBriefingOrSite' => 'confirmed_in_briefing_or_site',
            'pendingDecision' => 'pending_decision',
            'impactOnTeam' => 'impact_on_team',
            'validationStatus' => 'validation_status',
        ];
        $data = normalizeToSnake($input, $pendMap);
        unset($data['id']);

        if (isset($data['category'])) {
            assertEnum($data['category'], PENDING_CATEGORIES, 'category');
        }
        if (isset($data['validation_status'])) {
            assertEnum($data['validation_status'], PENDING_VALIDATION_STATUSES, 'validationStatus');
        }
        if (empty($data)) {
            errorResponse('Nenhum campo válido para atualização', 422);
        }

        try {
            $pdo = getPDO();
            $chk = $pdo->prepare('SELECT id FROM pending_items WHERE id = :id');
            $chk->execute([':id' => $pendId]);
            if (!$chk->fetch()) {
                errorResponse('Pending item não encontrado', 404);
            }

            $setParts = [];
            $params = [':id' => $pendId];
            foreach ($data as $col => $val) {
                $setParts[] = "{$col} = :{$col}";
                $params[":{$col}"] = $val;
            }
            $setParts[] = 'updated_at = :updated_at';
            $params[':updated_at'] = date('Y-m-d H:i:s');

            $sql = 'UPDATE pending_items SET ' . implode(', ', $setParts) . ' WHERE id = :id';
            $stmt = $pdo->prepare($sql);
            $stmt->execute($params);

            $sel = $pdo->prepare('SELECT * FROM pending_items WHERE id = :id');
            $sel->execute([':id' => $pendId]);
            $row = $sel->fetch();
            jsonResponse(rowToCamel($row));
        } catch (PDOException $e) {
            errorResponse('Erro ao atualizar pending item', 500);
        }
    }

    errorResponse('Method Not Allowed', 405);
}

// ---------------------------------------------------------------------------
// Nenhuma rota casada → 404
// ---------------------------------------------------------------------------
errorResponse('Not Found', 404);
