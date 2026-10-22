import { useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';

/** Fits a 210mm × 297mm sheet into the preview column; print uses the real A4 size. */
export const A4Frame = ({ children }: { children: ReactNode }) => {
    const hostRef = useRef<HTMLDivElement>(null);
    const pageRef = useRef<HTMLDivElement>(null);
    const [scale, setScale] = useState(1);
    const [height, setHeight] = useState<number>();

    useLayoutEffect(() => {
        const host = hostRef.current;
        const page = pageRef.current;
        if (!host || !page) return;

        const update = () => {
            const pageWidth = page.offsetWidth || 1;
            const pageHeight = page.offsetHeight || 0;
            const nextScale = Math.min(1, host.clientWidth / pageWidth);
            setScale(nextScale);
            setHeight(pageHeight * nextScale);
        };

        update();
        const ro = new ResizeObserver(update);
        ro.observe(host);
        return () => ro.disconnect();
    }, []);

    const hostStyle: CSSProperties = height ? { height } : {};

    return (
        <div ref={hostRef} className="a4-scale-host w-full" style={hostStyle}>
            <div
                ref={pageRef}
                className="a4-scale-page"
                style={{ transform: `scale(${scale})` }}
            >
                {children}
            </div>
        </div>
    );
};
