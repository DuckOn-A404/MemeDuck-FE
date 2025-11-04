import { type ReactNode, Children, useState, useEffect, useRef } from 'react';
import { Box } from '@mui/material';

interface MasonryGridProps {
  children: ReactNode;
  columnCount?: { xs: number; sm: number; md: number; lg: number };
  gap?: number;
}

const MasonryGrid = ({ 
  children, 
  columnCount = { xs: 1, sm: 2, md: 3, lg: 4 },
  gap = 16 
}: MasonryGridProps) => {
  const [columns, setColumns] = useState<ReactNode[][]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // 반응형 컬럼 개수 계산
  const getColumnCount = () => {
    if (typeof window === 'undefined') return columnCount.lg;
    const width = window.innerWidth;
    if (width < 600) return columnCount.xs;
    if (width < 900) return columnCount.sm;
    if (width < 1200) return columnCount.md;
    return columnCount.lg;
  };

  useEffect(() => {
    const distributeItems = () => {
      const cols = getColumnCount();
      const childArray = Children.toArray(children);
      
      // 각 컬럼을 빈 배열로 초기화
      const newColumns: ReactNode[][] = Array.from({ length: cols }, () => []);
      
      // 각 컬럼의 예상 높이를 추적 (균형있는 배치를 위해)
      const columnHeights = Array(cols).fill(0);
      
      // 각 아이템을 가장 짧은 컬럼에 배치
      childArray.forEach((child) => {
        // 가장 짧은 컬럼 찾기
        const minHeight = Math.min(...columnHeights);
        const targetColumnIndex = columnHeights.indexOf(minHeight);
        
        // 해당 컬럼에 아이템 추가
        newColumns[targetColumnIndex].push(child);
        
        // 예상 높이 업데이트 (실제 높이 대신 균등 분배)
        columnHeights[targetColumnIndex] += 1;
      });
      
      setColumns(newColumns);
    };

    distributeItems();

    // 윈도우 리사이즈 시 재배치
    const handleResize = () => distributeItems();
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, [children, columnCount]);

  return (
    <Box
      ref={containerRef}
      sx={{
        display: 'flex',
        gap: `${gap}px`,
        alignItems: 'flex-start',
      }}
    >
      {columns.map((column, columnIndex) => (
        <Box
          key={columnIndex}
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: `${gap}px`,
          }}
        >
          {column}
        </Box>
      ))}
    </Box>
  );
};

export default MasonryGrid;
