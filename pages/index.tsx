
import type { NextPage } from 'next'
import Head from 'next/head'

import { useState, useEffect } from 'react';

import { Board, GetLegalMoves, Piece, ProcessMove } from '../services/chess';
import Square from '../components/square';

const PieceMap = [ 'rc', 'n', 'b', 'q', 'kc', 'b', 'n', 'rc' ];

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
  const [selected, setSelected] = useState<number>(-1);
  const [legalMoves, setLegalMoves] = useState<number[]>([]);

  useEffect(() => {
    setLegalMoves(
      selected !== -1
        ? GetLegalMoves(board, selected)
        : []
    );
  }, [selected]);

  return (
    <>
      <Head>
        <title>Chess</title>
        <meta name="description" content="chess game app idk" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className='p-2 grid grid-cols-9 grid-rows-9 gap-2 w-max'>
        {board.map((item, index) => ( 
          <>
            {index % 8 === 0 && <div key={`piece-${8-(index/8)}`} className='w-24 h-24 flex justify-center items-center text-2xl font-bold
              bg-background'>{8 - (index / 8)}</div>}
            <Square
              key={index}
              piece={item}
              index={index}
              legal={legalMoves.includes(index)}
              selected={selected}
              setSelected={setSelected}
              onMove={(position, intended) => setBoard(ProcessMove(board, position, intended))}
              dark={Math.floor(index / 8) % 2 === 0 ? index % 2 === 1 : index % 2 === 0}
            />
          </>
        ))}
        {['', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'].map(item => (
          <div key={item} className='w-24 h-24 flex justify-center items-center text-2xl font-bold
            bg-background'>{item}</div>
        ))}
      </main>
    </>
  )
}

export default Home
