
import useInterval from 'use-interval';
import { FaClock, FaCrown } from 'react-icons/fa';

type Timer = {
  active?: boolean;
  secondary?: boolean;
  win?: boolean;

  time: number;
  setTime: (time: number) => void;
}

const Timer = ({
  time, setTime,
  active, secondary, win
}: Timer) => {
  useInterval(() => {
    setTime(time - 1);
  }, active && time !== 0 ? 1000 : null);

  return (
    <div className={`flex flex-row justify-between align-center text-2xl ${active && 'font-bold border-r-4'} ${win && 'font-bold'} p-2 pr-4 rounded-lg
      ${secondary
      ? 'text-primary border-primary bg-secondary'
      : 'text-secondary border-secondary bg-primary'}
      `}>
      <div className='p-[6px] pb-0'>
        {win ? <FaCrown /> : <FaClock />}
      </div>
      <p className='pb-[5px]'>{win ? 'WIN' : `${Math.floor(time / 60)}:${time % 60 < 10 ? `0${time % 60}` : time % 60}`}</p>
    </div>
  );
}

export default Timer;