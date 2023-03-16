//reduce base64 to the specified size (desired size should be in kilobytes)
export async function reduceBase64CodeSize(
	base64Code: string,
	desiredSizeInKiloBytes: number,
	fileType: string,
) {
	let compressedBase64: any = base64Code;
	let base64CodeSize = checkBase64FileSize(compressedBase64);
	const desiredSizeInBytes = desiredSizeInKiloBytes * 1024;

	while (base64CodeSize > desiredSizeInBytes) {
		compressedBase64 = await compressImage(compressedBase64, fileType);

		base64CodeSize = checkBase64FileSize(compressedBase64);
	}

	return compressedBase64;
}

// reduce image to 10% lesser size and return the new compressed base64
async function compressImage(base64: string, fileType: string) {
	const image = document.createElement("img");
	image.src = base64;

	let newBase64;

	await new Promise((resolve, reject) => {
		image.onload = (e: any) => {
			const width = e.target.width - Math.floor((10 / 100) * e.target.width);
			const height = e.target.height - Math.floor((10 / 100) * e.target.height);
			const canvas = document.createElement("canvas");
			canvas.width = width;
			canvas.height = height;
			const context: any = canvas.getContext("2d");

			context.drawImage(e.target, 0, 0, width, height);

			const result = context.canvas.toDataURL(fileType);

			resolve(result);
		};
	}).then((res) => {
		newBase64 = res;
	});

	return newBase64;
}

// check base64 byte size
export default function checkBase64FileSize(base64Code: string) {
	let y = 0;

	if (base64Code.endsWith("==")) {
		y = 2;
	} else if (base64Code.endsWith("=")) {
		y = 1;
	}

	const bytesSize = Math.floor((base64Code.length * 3) / 4 - y);

	return bytesSize;
}
