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
        //openGraph: {
        //    images: {
        //        url: `https://placehold.co/1200x630?text=${titleAndDescription}`,
        //        height: 630,
        //        width: 1200,
        //        alt: titleAndDescription,
        //    },
        //},
    };
}

export default function Home({ searchParams }: Props) {
    return <ThalaInput searchParams={searchParams} />;
}
