
import type { NextPage } from 'next'
import Head from 'next/head'

import { useState, useEffect } from 'react';

import { Board, GetLegalMoves, isBlack, IsCheckmate, isWhite, Move, Piece, ProcessMove } from '../services/chess';
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
  const [moves, setMoves] = useState<Move[]>([]);

  const [selected, setSelected] = useState<number>(-1);
  const [legalMoves, setLegalMoves] = useState<number[]>([]);
  const [whiteTurn, setWhiteTurn] = useState<boolean>(true);
  const [checkmate, setCheckmate] = useState<boolean>(false);

  const mapMoves = () => {
    return moves.map(move => move.algebraic).reduce((prev, next, index, arr) => {
      if(index % 2 === 1) return prev;
      if(index + 1 >= moves.length) return [ ...prev, [ next ] ];
      return [ ...prev, [ next, arr[index + 1] ] ];
    }, [] as string[][]);
  };

  useEffect(() => {
    setLegalMoves(
      selected !== -1
        ? GetLegalMoves(board, selected, undefined, undefined, true)
        : []
    );
  }, [selected]);

  useEffect(() => {
    if(checkmate) {
      console.log('checkmate');
    }
  }, [checkmate]);

  return (
    <>
      <Head>
        <title>Chess</title>
        <meta name="description" content="chess game app idk" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className='p-2 grid grid-cols-2'>
        <div className='p-2 grid grid-cols-9 grid-rows-9 gap-2'>
          {board.map((item, index) => ( 
            <>
              {index % 8 === 0 && <div key={`piece-${8-(index/8)}`} className='w-12 h-12 flex justify-center items-center text-lg font-bold bg-background
                sm:w-16 sm:h-16 sm:text-xl
                md:w-20 md:h-20 md:text-2xl
                lg:w-24 lg:h-24'>{8 - (index / 8)}</div>}
              <Square
                key={index}
                piece={item}
                index={index}
                legal={legalMoves.includes(index)}
                selected={selected}
                setSelected={setSelected}
                canSelect={(piece) => whiteTurn ? isWhite(piece) : isBlack(piece)}
                onMove={(position, intended) => {
                  const processed = ProcessMove(board, position, intended);

                  setBoard(processed.board);
                  processed.move && setMoves([...moves, processed.move]);

                  setWhiteTurn(!whiteTurn);

                  setCheckmate(
                    IsCheckmate(processed.board, whiteTurn)
                  );
                }}
                dark={Math.floor(index / 8) % 2 === 0 ? index % 2 === 1 : index % 2 === 0}
              />
            </>
          ))}
          {['', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'].map(item => (
            <div key={item} className='w-12 h-12 flex justify-center items-center text-lg font-bold bg-background
              sm:w-16 sm:h-16 sm:text-xl
              md:w-20 md:h-20 md:text-2xl
              lg:w-24 lg:h-24
              '>{item}</div>
          ))}
        </div>

        <div className='p-2'>
          {mapMoves().map((move, index) => (
            <p>{index + 1}: {move[0]}{move.length > 1 && '\t'}{move.length > 1 && move[1]}</p>
          ))}
        </div>
      </main>
    </>
  )
}

export default Home
