import { Image } from "@nextui-org/react";
import Link from "next/link";
import React from "react";

export default function Project({
	title,
	description,
	image,
	link,
}: {
	title: string;
	description: string;
	image: string;
	link: string;
}) {
	return (
		<Link href={link} target="_blank" rel="noopener noreferrer">
			<div className="grid md:grid-cols-2 grid-cols-1 h-full shadow-sm border-gray-200 bg-default-50 border-opacity-60 rounded-lg overflow-hidden border-2 transition-all border-transparent hover:border-secondary">
				<Image
					className="h-full object-cover object-center"
					src={image}
					alt={title}
					radius="none"
				/>
				<div className="md:p-6 p-3">
					<h1 className="text-2xl font-extrabold mb-3">{title}</h1>
					<p className="leading-relaxed mb-3">{description}</p>
				</div>
			</div>
		</Link>
	);
}