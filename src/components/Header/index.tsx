import Image from "next/image";
import styles from "./header.module.scss";

export default function Header() {
	return (
		<header id={styles.header}>
			<div id={styles.brand}>
				<Image
					src="/logo.svg"
					alt="site logo"
					width={109}
					height={107}
					quality={1}
				/>
				<h1>משלט ביקורים</h1>
			</div>
			<nav>
				{/* TODO: toggle buttons component (using ul-li-button) */}
			</nav>
		</header>
	);
}
