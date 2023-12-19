"use client"
import { useEffect, useState } from "react"
import Marquee, { Motion, randomIntFromInterval } from "react-marquee-slider"

export default function Home() {
	const THALA_NUMBER = 7
	const [text, setText] = useState<string>("")
	const [isMounted, setIsMounted] = useState(false)
	const [isThala, setIsThala] = useState(false)
	const [thalaReason, setThalaReason] = useState<string>("Not a Thala")
	const videoSources = ["thala_for_a_reason.mp4", "thala_for_a_reason2.mp4"]

	useEffect(() => {
		setIsMounted(true)
	}, [])

	function sumTheString(plainText: string, _thalaReason: string = ""): { sum: number; _thalaReason: string } {
		const sum = plainText.split("").reduce((acc, curr, index) => {
			const num = Number(curr) || 0
			if (index === 0) {
				_thalaReason += `${num} `
			} else {
				_thalaReason += `+ ${num} `
			}
			const sum = acc + num
			return sum
		}, 0)

		_thalaReason += `= ${sum}`

		if (sum.toString().length > 1) {
			_thalaReason += `<br />`
			return sumTheString(sum.toString(), _thalaReason)
		}
		return { sum, _thalaReason }
	}

	function setThalaReasonString(reason: string, isThala: boolean = false) {
		if (isThala) {
			reason += `<br /> <b> Thala for a reason </b>`
		} else {
			reason += `<br /> <b><s> Not a Thala </s></b>`
		}
		console.log({ reason, isThala })
		setThalaReason(reason)
	}

	async function shareLink() {
		try {
			const base64Text = btoa(text)
			const url = `${window.location.origin}?name${base64Text}`
			if (!navigator.canShare) {
				await navigator.clipboard.writeText(url)
				alert("Copied to clipboard")
			} else {
				const shareData: ShareData = {
					title: "Thala Checker",
					text: url,
					url,
				}
				if (navigator.canShare(shareData)) {
					await navigator.share(shareData)
				} else {
					await navigator.clipboard.writeText(text)
					alert("Copied to clipboard")
				}
			}
		} catch (error) {
			console.error(error)
			alert(String(error))
		}
	}
	function checkForThala() {
		if (!text) {
			return
		}
		setThalaReason("")
		const plainText = text.trim()
		if (Number(plainText)) {
			let { sum, _thalaReason } = sumTheString(plainText)
			setThalaReasonString(_thalaReason, sum === THALA_NUMBER)
			setIsThala(sum === THALA_NUMBER)
			return
		}
		let textWithPlus = plainText.split("").join(" + ")
		const _thalaReason = textWithPlus + ` = ${plainText.length}`
		setThalaReasonString(_thalaReason, plainText.length === THALA_NUMBER)
		setIsThala(plainText.length === THALA_NUMBER)
	}

	function getRandomVideo() {
		return videoSources[Math.floor(Math.random() * videoSources.length)]
	}

	return (
		<div className="h-80vh flex flex-col justify-center">
			<div className="flex flex-col justify-center items-center mt-56 pl-3 pr-3">
				<input
					type="text"
					name="text"
					id="text"
					onKeyDown={(e) => {
						if (e.key === "Enter") {
							checkForThala()
						}
					}}
					onChange={(e) => {
						setText(e.target.value)
					}}
					className="w-full sm:w-5/12 h-10 rounded-lg focus:outline-none placeholder:text-red-700 p-2"
				/>
				<button className="bg-purple-700 w-36 mt-2 rounded-3xl m-10 p-4 text-white font-bold" onClick={checkForThala}>
					Submit
				</button>
			</div>
			<div className="text-white font-bold text-center text-2xl">
				<span dangerouslySetInnerHTML={{ __html: thalaReason }}></span>
			</div>
			{isMounted && isThala && (
				<div
					className="fixed z-10 w-screen h-screen top-0 left-0 flex justify-center items-center"
					style={{
						zIndex: -100,
					}}
				>
					<video
						autoPlay
						playsInline
						muted={false}
						className="fixed z-0 w-screen h-screen top-0 left-0"
						style={{ objectFit: "cover", zIndex: -70, backgroundColor: "transparent", opacity: 0.6 }}
						onEnded={() => setIsThala(false)}
					>
						<source src={`/videos/${getRandomVideo()}`} type="video/mp4" />
					</video>
				</div>
			)}
			<div className="text-center mt-3">
				<button onClick={shareLink} className="bg-purple-700 w-36 mt-2 rounded-3xl m-10 p-4 text-white font-bold">
					Share Link
				</button>
			</div>
		</div>
	)
}
