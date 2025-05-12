import { useId } from 'react'
import clsx from 'clsx'

const formClasses =
  'block w-full appearance-none rounded-lg border border-gray-200 bg-white py-[calc(--spacing(2)-1px)] px-[calc(--spacing(3)-1px)] text-gray-900 placeholder:text-gray-400 focus:border-cyan-500 focus:outline-hidden focus:ring-cyan-500 sm:text-sm'

function Label({ id, children }) {
  return (
    <label
      htmlFor={id}
      className="mb-2 block text-sm font-semibold text-gray-900"
    >
      {children}
    </label>
  )
}

export function TextField({ label, type = 'text', className, value, defaultValue, onChange, ...props }) {
    const id = useId()
    const isControlled = value !== undefined
  
    return (
      <div className={className}>
        {label && <Label htmlFor={id}>{label}</Label>}
        <input
          id={id}
          type={type}
          className={formClasses}
          value={isControlled ? value : undefined}
          defaultValue={!isControlled ? defaultValue : undefined}
          onChange={onChange}
          {...props}
        />
      </div>
    )
  }

export function SelectField({ label, className, ...props }) {
  let id = useId()

  return (
    <div className={className}>
      {label && <Label id={id}>{label}</Label>}
      <select id={id} {...props} className={clsx(formClasses, 'pr-8')} />
    </div>
  )
}