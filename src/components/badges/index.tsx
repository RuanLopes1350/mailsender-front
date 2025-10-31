// Componente auxiliar para formatar datas
export const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    });
};

// Componente de badge de status para emails
export const EmailStatusBadge = ({ status }: { status: 'sent' | 'failed' | 'pending' }) => {
    const styles = {
        sent: 'bg-[#DCFCE7] text-[#15803D]',
        failed: 'bg-[#fcdcdc] text-[#801515]',
        pending: 'bg-[#fef3c7] text-[#854d0e]'
    };

    const labels = {
        sent: 'Enviado',
        failed: 'Falha',
        pending: 'Pendente'
    };

    return (
        <div className={`p-2 w-[80px] rounded-lg flex items-center justify-center ${styles[status]}`}>
            {labels[status]}
        </div>
    );
};

// Componente de badge de status para API Keys
export const ApiKeyStatusBadge = ({ isActive }: { isActive: boolean }) => {
    return (
        <div className={`p-2 w-[70px] rounded-lg flex items-center justify-center ${isActive ? 'bg-[#DCFCE7] text-[#15803D]' : 'bg-[#fcdcdc] text-[#801515]'
            }`}>
            {isActive ? 'Ativa' : 'Inativa'}
        </div>
    );
};

export const StatusCodeBadge = ({ code }: { code: number }) => {
    const styles: Record<number, string> = {
        200: 'bg-[#DCFCE7] text-[#15803D]',
        201: 'bg-[#DCFCE7] text-[#15803D]',
        400: 'bg-[#fcdcdc] text-[#801515]',
        404: 'bg-[#fcdcdc] text-[#801515]',
        500: 'bg-[#fcdcdc] text-[#801515]',
    };
    return (
        <div className={`p-2 w-[70px] rounded-lg flex items-center justify-center ${styles[code] || 'bg-gray-200'}`}>
            {code}
        </div>
    );
};

// Componente de badge para métodos HTTP
export const HttpMethodBadge = ({ method }: { method: string }) => {
    const styles: Record<string, string> = {
        'GET': 'bg-[#dcf4fc] text-[#156080]',
        'POST': 'bg-[#DCFCE7] text-[#15803D]',
        'PATCH': 'bg-[#fbfcdc] text-[#808015]',
        'DELETE': 'bg-[#fcdcdc] text-[#801515]',
    };

    return (
        <div className={`p-2 w-[70px] rounded-xl flex items-center justify-center ${styles[method] || 'bg-gray-200'}`}>
            {method}
        </div>
    );
};
