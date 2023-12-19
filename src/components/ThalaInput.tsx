'use client';
import { ToastContainer, toast } from 'react-toastify';
import React, { useEffect, useState } from 'react';
import 'react-toastify/dist/ReactToastify.css';

export function ThalaInput({
    searchParams,
}: {
    searchParams: Record<string, string>;
}) {
    const THALA_NUMBER = 7;
    const videoSources = ['thala_for_a_reason.mp4', 'thala_for_a_reason2.mp4'];

    const [text, setText] = useState<string>('');
    const [thalaReason, setThalaReason] = useState<string>('');
    const [isMounted, setIsMounted] = useState<boolean>(false);
    const [isThala, setIsThala] = useState<boolean>(false);
    const [isVideoMuted, setIsVideoMuted] = useState<boolean>(false);

    useEffect(() => {
        if (!isMounted) {
            setIsMounted(true);
        }
        if (searchParams.name) {
            const decryptedText = atob(searchParams.name);
            setText(decryptedText);
            checkForThala(decryptedText);
        }
    }, []);

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
        setThalaReason(reason);
    }

    async function shareLink() {
        try {
            const base64Text = btoa(text);
            const url = `${window.location.origin}?name=${base64Text}`;
            if (!navigator.canShare) {
                await navigator.clipboard.writeText(url);
                toast.success('Copied to clipboard', {
                    position: 'top-center',
                });
            } else {
                const shareData: ShareData = {
                    title: 'Thala Checker',
                    text: url,
                    url,
                };
                if (navigator.canShare(shareData)) {
                    await navigator.share(shareData);
                }
            }
        } catch (error) {
            const errorMessage = String(error);
            // this is because when we use navigator.share api and if we close share dialog it shows error.
            if (errorMessage.includes('AbortError')) {
                return;
            }
            toast.error(errorMessage, {
                position: 'top-center',
            });
        }
    }
    function checkForThala(_text?: string) {
        if (!text && !_text) {
            return;
        }
        setThalaReason('');
        const plainText = text.trim() || _text?.trim() || '';
        if (Number(plainText)) {
            let { sum, _thalaReason } = sumTheString(plainText);
            setThalaReasonString(_thalaReason, sum === THALA_NUMBER);
            setIsThala(sum === THALA_NUMBER);
            return;
        }
        let textWithPlus = plainText.split('').join(' + ');
        const _thalaReason = textWithPlus + ` = ${plainText.length}`;
        setThalaReasonString(_thalaReason, plainText.length === THALA_NUMBER);
        setIsThala(plainText.length === THALA_NUMBER);
    }

    function getRandomVideo() {
        return videoSources[Math.floor(Math.random() * videoSources.length)];
    }

    return (
        <>
            <ToastContainer />
            <div className='h-80vh flex flex-col justify-center'>
                <div className='flex flex-col justify-center items-center mt-56 pl-3 pr-3'>
                    <input
                        type='text'
                        name='text'
                        id='text'
                        value={text}
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
                        className='bg-purple-700 hover:bg-purple-500 w-36 mt-2 rounded-3xl m-10 p-4 text-white font-bold disabled:bg-purple-300 disabled:cursor-not-allowed'
                        onClick={() => checkForThala()}
                        disabled={!text}
                    >
                        Submit
                    </button>
                </div>
                <div className='text-white font-bold text-center text-2xl'>
                    <span
                        dangerouslySetInnerHTML={{ __html: thalaReason }}
                    ></span>
                </div>
                {isMounted && isThala && (
                    <div
                        className='fixed z-10 w-screen h-screen top-0 left-0 flex justify-center items-center'
                        style={{
                            zIndex: -100,
                        }}
                    >
                        <video
                            autoPlay={true}
                            playsInline={true}
                            muted={isVideoMuted}
                            className='h-auto w-full min-h-full min-w-full z-[70] top-0 left-0 bg-transparent opacity-[0.6] object-cover'
                            onEnded={() => setIsThala(false)}
                            onError={(e) => alert(String(e))}
                        >
                            <source
                                src={`/videos/${getRandomVideo()}`}
                                type='video/mp4'
                            />
                        </video>
                    </div>
                )}
                <div className='text-center mt-3'>
                    <button
                        onClick={shareLink}
                        className='bg-purple-700 hover:bg-purple-500 w-36 mt-2 rounded-3xl m-10 p-4 text-white font-bold disabled:bg-purple-300 disabled:cursor-not-allowed'
                        disabled={!thalaReason}
                    >
                        Share Link
                    </button>
                </div>
                <div className='fixed bottom-4 right-4'>
                    <button
                        onClick={() => setIsVideoMuted((state) => !state)}
                        className='bg-purple-700 hover:bg-purple-500 text-white font-bold py-2 px-4 rounded-3xl'
                    >
                        {isVideoMuted ? 'Unmute' : 'Mute'} Video
                    </button>
                </div>
            </div>
        </>
    );
}
