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
    const titleAndDescription = `Is ${name} a Thala?`;
    return {
        title: titleAndDescription,
        description: titleAndDescription,
        applicationName: 'Thala Checker',
        authors: [
            {
                name: 'Bhoomit Ganatra',
                url: 'https://www.linkedin.com/in/bhoomit-ganatra/',
            },
            {
                name: 'Hardik Modi',
                url: 'https://www.linkedin.com/in/hardikmodi58677/',
            },
        ],
    };
}

export default function Home({ searchParams }: Props) {
    return <ThalaInput searchParams={searchParams} />;
}
