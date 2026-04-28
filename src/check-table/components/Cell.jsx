import { X } from 'lucide-react'
import { getTagStyle } from '../App.jsx'
import TagDropdown from './TagDropdown.jsx'

export default function Cell({ tags, customTags, isOpen, onOpen, onToggleTag, onRemoveTag, onAddCustomTag, onClose }) {
  return (
    <div
      className="min-h-[36px] px-2 py-1.5 cursor-pointer flex flex-wrap gap-1 items-start relative"
      onClick={onOpen}
    >
      {tags.map(tag => (
        <span
          key={tag}
          className={`inline-flex items-center gap-0.5 text-xs font-medium px-2 py-0.5 rounded-full border ${getTagStyle(tag, customTags)}`}
          onClick={e => e.stopPropagation()}
        >
          {tag}
          <button
            onClick={e => { e.stopPropagation(); onRemoveTag(tag) }}
            className="hover:opacity-70 transition-opacity ml-0.5"
          >
            <X size={10} />
          </button>
        </span>
      ))}

      {isOpen && (
        <TagDropdown
          selected={tags}
          customTags={customTags}
          onToggle={onToggleTag}
          onAddCustomTag={onAddCustomTag}
          onClose={onClose}
        />
      )}
    </div>
  )
}
