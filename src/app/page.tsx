'use client';
import { useState } from 'react';

export default function Home() {
    const THALA_NUMBER = 7;
    const [text, setText] = useState<string>('');
    const [thalaReason, setThalaReason] = useState<string>('Not a Thala');

    function sumTheString(
        plainText: string,
        _thalaReason: string = '',
    ): { sum: number; _thalaReason: string } {
        const sum = plainText.split('').reduce((acc, curr, index) => {
            const num = Number(curr) || 0;
            if (index === 0) {
                _thalaReason += `${num} `;
            } else {
                _thalaReason += `+ ${num} `;
            }
            const sum = acc + num;
            return sum;
        }, 0);

        _thalaReason += `= ${sum}`;

        if (sum.toString().length > 1) {
            _thalaReason += `<br />`;
            return sumTheString(sum.toString(), _thalaReason);
        }
        return { sum, _thalaReason };
    }

    function setThalaReasonString(reason: string, isThala: boolean = false) {
        if (isThala) {
            reason += `<br /> <b> Thala for a reason </b>`;
        } else {
            reason += `<br /> <b><s> Not a Thala </s></b>`;
        }
        console.log({ reason, isThala });
        setThalaReason(reason);
    }

    function checkForThala() {
        if (!text) {
            return;
        }
        setThalaReason('');
        const plainText = text.trim();
        if (Number(plainText)) {
            let { sum, _thalaReason } = sumTheString(plainText);
            setThalaReasonString(_thalaReason, sum === THALA_NUMBER);
            return;
        }
        let textWithPlus = plainText.split('').join(' + ');
        const _thalaReason = textWithPlus + ` = ${plainText.length}`;
        setThalaReasonString(_thalaReason, plainText.length === THALA_NUMBER);
    }

    async function shareLink() {
        try {
            const base64Text = btoa(text);
            const url = `window.location.origin?name${base64Text}`;
            if (!navigator.canShare) {
                await navigator.clipboard.writeText(url);
                alert('Copied to clipboard');
            } else {
                const shareData: ShareData = {
                    title: 'Thala Checker',
                    text: url,
                    url,
                };
                if (navigator.canShare(shareData)) {
                    await navigator.share(shareData);
                } else {
                    await navigator.clipboard.writeText(text);
                    alert('Copied to clipboard');
                }
            }
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div className='h-screen'>
            <div className='flex flex-col justify-center items-center mt-56 pl-3 pr-3'>
                <input
                    type='text'
                    name='text'
                    id='text'
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            checkForThala();
                        }
                    }}
                    onChange={(e) => {
                        setText(e.target.value);
                    }}
                    className='w-full sm:w-5/12 h-10 rounded-lg focus:outline-none placeholder:text-red-700 p-2'
                />
                <button
                    className='bg-purple-700 w-36 mt-2 rounded-3xl m-10 p-4 text-white font-bold'
                    onClick={checkForThala}
                >
                    Submit
                </button>
            </div>
            <div className='text-white font-bold text-center text-2xl'>
                <span dangerouslySetInnerHTML={{ __html: thalaReason }}></span>
            </div>
            <div className='text-center mt-3'>
                <button
                    onClick={shareLink}
                    className='bg-purple-700 w-36 mt-2 rounded-3xl m-10 p-4 text-white font-bold'
                >
                    Share Link
                </button>
            </div>
        </div>
    );
}
