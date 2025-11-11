import RankBadge from './RankBadge';
import type { RankLevel } from '../../types';

interface NicknameWithRankProps {
  nickname: string;
  rankLevel?: RankLevel;
  badgeSize?: number;
  className?: string;
}

/**
 * 닉네임이 나오는 모든 곳에서 이 컴포넌트를 쓰면
 * 랭크 UI를 한 군데서만 관리할 수 있다.
 */
const NicknameWithRank = ({
  nickname,
  rankLevel,
  badgeSize = 16,
  className = "",
}: NicknameWithRankProps) => {
  return (
    <span className={`inline-flex items-center gap-[0.5px] ${className}`}>
      <span>{nickname}</span>
      {rankLevel && <RankBadge rankLevel={rankLevel} size={badgeSize} />}
    </span>
  );
};

export default NicknameWithRank;
