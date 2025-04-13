import { useDraggable } from '@dnd-kit/core';
import { motion, MotionStyle } from 'framer-motion';
import { MdOutlineRemoveCircle } from 'react-icons/md';
import { FADE, TRANSITION } from '../../../constants/animations';

interface DraggableFieldProps {
  id: string;
  field: string;
  fieldMapping?: { [key: string]: string };
  onRemove?: () => void;
  isDraggable?: boolean;
  isFieldList?: boolean;
  sideIndex?: number;
}

export default function DraggableField({ 
  id, 
  field, 
  fieldMapping, 
  onRemove, 
  isDraggable = true,
  isFieldList = false,
  sideIndex
}: DraggableFieldProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useDraggable({
    id: isFieldList 
      ? `field-${id}` 
      : `side-${sideIndex}-${id}`,
    disabled: !isDraggable,
  });

  const style: MotionStyle = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    zIndex: isDragging ? 50 : 'auto',
    position: 'relative' as const,
  } : {};

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      variants={FADE}
      initial="hidden"
      animate="visible"
      exit="exit"
      transition={TRANSITION.QUICK}
      className={`bg-white w-full text-lg secondary-text p-1 px-2 rounded border-[1px] border-gray-200 flex flex-row justify-between items-center ${
        isDraggable ? "hover:cursor-grab active:cursor-grabbing" : ""
      }`}
      {...(isDraggable ? { ...attributes, ...listeners } : {})}
    >
      {fieldMapping ? fieldMapping[field] : field}
      {onRemove && (
        <button onClick={onRemove} className="mx-2">
          <MdOutlineRemoveCircle color="#ad343e" size="20" />
        </button>
      )}
    </motion.div>
  );
} 