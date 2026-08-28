'use client';

import {QueryClientProvider} from '@tanstack/react-query';
import {queryClient} from './queryClient';
import { useState } from 'react';

export default function QueryProvider({children}: {children: React.ReactNode}) {
    const [client] = useState(() => queryClient);

    return(
        <QueryClientProvider client={client}>
            {children}
        </QueryClientProvider>
    );
}
