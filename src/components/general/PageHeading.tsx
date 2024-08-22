"server-only";

type Props = {
	children: string;
};

export default function PageHeading({ children }: Props) {
	if (globalThis.isMobile) {
		globalThis.currentPageName = children;
	} else return <h1>{children}</h1>;
}
