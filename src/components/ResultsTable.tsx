"use client";

import { useMemo } from "react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

type RaceResult = {
  id: string;
  name: string;
  category: string;
  time: string;
  position: number;
};

const columnHelper = createColumnHelper<RaceResult>();

const defaultData: RaceResult[] = [
  { id: "1", name: "Jan Kowalski", category: "M3", time: "02:14:30", position: 1 },
  { id: "2", name: "Piotr Nowak", category: "M2", time: "02:18:15", position: 4 },
  { id: "3", name: "Anna Wiśniewska", category: "K2", time: "02:35:40", position: 2 },
  { id: "4", name: "Michał Wójcik", category: "M4", time: "02:40:10", position: 12 },
  { id: "5", name: "Kamil Kamiński", category: "M2", time: "02:10:05", position: 3 },
];

export default function ResultsTable() {
  const columns = useMemo(
    () => [
      columnHelper.accessor("position", {
        header: "Miejsce",
        cell: (info) => (
          <span className="font-bold text-[var(--color-lgr-red)]">
            {info.getValue()}
          </span>
        ),
      }),
      columnHelper.accessor("name", {
        header: "Zawodnik",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("category", {
        header: "Kategoria",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("time", {
        header: "Czas",
        cell: (info) => info.getValue(),
      }),
    ],
    []
  );

  const table = useReactTable({
    data: defaultData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="w-full bg-[#1A1A1A] rounded-2xl overflow-hidden border border-white/5">
      <div className="p-6 border-b border-white/5 flex items-center justify-between">
        <h3 className="text-xl font-bold uppercase tracking-wide text-white">Wyniki / Maraton MTB Limanowa 2024</h3>
        <span className="text-[var(--color-lgr-red)] text-sm font-semibold uppercase">Wszystkie dane</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-300">
          <thead className="bg-[#111111] text-xs uppercase text-gray-500">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="px-6 py-4 font-medium tracking-wider">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-white/5">
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className="hover:bg-[var(--color-lgr-red)] hover:text-white transition-colors duration-200 group cursor-pointer bg-[#1A1A1A]"
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-6 py-4 whitespace-nowrap group-hover:text-white">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
