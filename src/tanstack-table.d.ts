import '@tanstack/react-table'

declare module '@tanstack/react-table' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData, TValue> {
    /** Label for the column picker. */
    title?: string
    /** Classes for both th and td (e.g. responsive visibility). */
    className?: string
    tdClassName?: string
    thClassName?: string
  }
}
