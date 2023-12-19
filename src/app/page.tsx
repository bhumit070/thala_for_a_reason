import { ThalaInput } from '@/components/ThalaInput';
import { Metadata } from 'next';

interface Props {
    searchParams: Record<string, string>;
}

export async function generateMetadata({
    searchParams,
}: Props): Promise<Metadata | null> {
    const name = atob(searchParams.name || '');
    if (!name) {
        return null;
    }

    return {
        title: name,
        description: `Is ${name} a Thala?`,
    };
}

export default function Home({ searchParams }: Props) {
    return <ThalaInput searchParams={searchParams} />;
}
