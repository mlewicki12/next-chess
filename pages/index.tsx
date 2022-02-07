
import type { NextPage } from 'next'
import Head from 'next/head'

import { useState } from 'react';
import Square, { Piece } from '../components/square';

type Board = Piece[];

const PieceMap = [ 'r', 'n', 'b', 'q', 'k', 'b', 'n', 'r' ];

const defineBoard = () => {
  return Array.apply(null, Array(64)).map((_, index) =>
    index <= 7
    ? PieceMap[index] as Piece
    : index > 7 && index < 16
      ? Piece.BLACK_PAWN
      : index > 47 && index < 56
        ? Piece.WHITE_PAWN
        : index >= 56
          ? PieceMap[index - 56].toUpperCase() as Piece
          : Piece.EMPTY );
}

const Home: NextPage = () => {
  const [board, setBoard] = useState<Board>(defineBoard());

  return (
    <main className='p-2 grid grid-cols-9 grid-rows-9 gap-2 w-max'>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {board.map((item, index) => ( 
        <>
          {index % 8 === 0 && <div className='w-24 h-24 flex justify-center items-center text-2xl font-bold
            bg-background'>{8 - (index / 8)}</div>}
          <Square key={index} piece={item} dark={Math.floor(index / 8) % 2 === 0} />
        </>
       ))}
       {['', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'].map(item => (
         <div className='w-24 h-24 flex justify-center items-center text-2xl font-bold
          bg-background'>{item}</div>
       ))}
    </main>
  )
}

export default Home
