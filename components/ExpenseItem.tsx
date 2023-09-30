import { currencyFormatter } from '@/lib/utils'
import React from 'react'

type ExpenseItemProps = {
    color: string;
    title: string;
    amount: number;
}

function ExpenseItem({color, title, amount}: ExpenseItemProps ) {
  return (
    <div className="flex items-center justify-between p-4 bg-slate-700 rounded-3xl hover:scale-105 transition-all duration-200">
    <div className="flex items-center gap-2">
      <div className="w-[25px] h-[25px] rounded-full" style={{backgroundColor: color}}/>
      <h4 className="capitalize">{title}</h4>
    </div>
    <p>{currencyFormatter(amount)}</p>
  </div>
  )
}

export default ExpenseItem
