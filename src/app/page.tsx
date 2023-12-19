'use client';
import { useState } from 'react';

export default function Home() {
    const THALA_NUMBER = 7;
    const [text, setText] = useState('');

    function sumTheString(plainText: string): number {
        const sum = plainText.split('').reduce((acc, curr) => {
            const num = Number(curr);
            if (num) {
                return acc + num;
            }
            return acc;
        }, 0);

        if (sum.toString().length > 1) {
            return sumTheString(sum.toString());
        }
        return sum;
    }

    function checkForThala() {
        const plainText = text.trim();
        if (Number(plainText)) {
            const sum = sumTheString(plainText);
            console.log(sum);
            if (sum === THALA_NUMBER) {
                alert('Thala');
            } else {
                alert('Not Thala');
            }
            return;
        }
        if (plainText.length === THALA_NUMBER) {
            alert('Thala');
        } else {
            alert('Not Thala');
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
        </div>
    );
}
