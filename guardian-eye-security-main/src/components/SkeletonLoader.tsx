import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface SkeletonLoaderProps {
    type?: "card" | "table" | "chart" | "stats";
    count?: number;
}

const SkeletonLoader = ({ type = "card", count = 1 }: SkeletonLoaderProps) => {
    if (type === "stats") {
        return (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[...Array(3)].map((_, i) => (
                    <Card key={i} className="animate-pulse">
                        <CardHeader className="space-y-2">
                            <div className="h-4 w-24 bg-muted rounded skeleton" />
                            <div className="h-8 w-16 bg-muted rounded skeleton" />
                        </CardHeader>
                        <CardContent>
                            <div className="h-3 w-32 bg-muted rounded skeleton" />
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }

    if (type === "chart") {
        return (
            <Card className="animate-pulse">
                <CardHeader className="space-y-2">
                    <div className="h-6 w-48 bg-muted rounded skeleton" />
                    <div className="h-4 w-64 bg-muted rounded skeleton" />
                </CardHeader>
                <CardContent>
                    <div className="h-64 bg-muted rounded skeleton" />
                </CardContent>
            </Card>
        );
    }

    if (type === "table") {
        return (
            <Card className="animate-pulse">
                <CardHeader className="space-y-2">
                    <div className="h-6 w-48 bg-muted rounded skeleton" />
                    <div className="h-4 w-64 bg-muted rounded skeleton" />
                </CardHeader>
                <CardContent className="space-y-3">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="flex gap-4">
                            <div className="h-4 w-full bg-muted rounded skeleton" />
                            <div className="h-4 w-full bg-muted rounded skeleton" />
                            <div className="h-4 w-full bg-muted rounded skeleton" />
                        </div>
                    ))}
                </CardContent>
            </Card>
        );
    }

    return (
        <>
            {[...Array(count)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                    <CardHeader className="space-y-2">
                        <div className="h-6 w-48 bg-muted rounded skeleton" />
                        <div className="h-4 w-64 bg-muted rounded skeleton" />
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="h-4 w-full bg-muted rounded skeleton" />
                        <div className="h-4 w-3/4 bg-muted rounded skeleton" />
                        <div className="h-4 w-5/6 bg-muted rounded skeleton" />
                    </CardContent>
                </Card>
            ))}
        </>
    );
};

export default SkeletonLoader;
