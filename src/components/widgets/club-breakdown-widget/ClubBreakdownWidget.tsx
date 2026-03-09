"use client";

import React, { useMemo, useState } from "react";
import { IoMdInformationCircleOutline } from "react-icons/io";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  CellContext,
} from "@tanstack/react-table";

import styles from "./ClubBreakdownWidget.module.scss";
import { BREAKDOWN_FIELDS, ShotField } from "@/lib/shots/fieldConfigMap";

export type ShotRow = {
  id: string;
  [key: string]: string | number | null;
};

type ShotTableProps = {
  data: ShotRow[];
};

const ClubBreakdownWidget: React.FC<ShotTableProps> = ({ data }) => {
  const [selectedRowIds, setSelectedRowIds] = useState<Record<string, boolean>>(
    {},
  );

  console.log(data)

  const getOfflineColor = (value: number | null) => {
    if (value === null) return styles.neutral;
    const abs = Math.abs(value);
    if (abs <= 5) return styles.good;
    if (abs <= 10) return styles.neutral;
    return styles.bad;
  };

  const formatValue = (value: unknown): string => {
    if (value == null) return "—";
    const num = Number(value);
    if (!Number.isNaN(num) && num !== 0) return num.toFixed(0);
    return String(value);
  };

  const maxShots = useMemo(() => {
    return Math.max(...data.map((row) => Number(row.shots) || 0), 0);
  }, [data]);

  const columns = useMemo<ColumnDef<ShotRow>[]>(() => {
    const dataColumns: ColumnDef<ShotRow>[] = BREAKDOWN_FIELDS.map(
      (field: ShotField) => ({
        accessorKey: field.key,
        header: field.label,
        cell: (info) => {
          const value = info.getValue();
          let className = styles.value;

          if (info.column.id === "avgOffline") {
            className += ` ${getOfflineColor(Number(value))}`;
          }

          if (field.key === "club") {
            const shots = Number(info.row.original.shots) || 0;
            const percent = maxShots ? (shots / maxShots) * 100 : 0;

            return (
              <div className={styles.clubCell}>
                <span className={styles.clubName}>{value as string}</span>

                <div className={styles.barContainer}>
                  <div
                    className={styles.bar}
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            );
          }

          return (
            <p className={className}>
              {formatValue(value)}
              {field.unit && <span>{field.unit}</span>}
            </p>
          );
        },
      }),
    );

    return [...dataColumns];
  }, [selectedRowIds, maxShots]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className={styles.widget}>
      <div className={styles.header}>
        <p>Club Breakdown</p>
        <p className={styles.description}>
          Avg stats per club this session · click a row to inspect miss tendency
          below
        </p>
      </div>
      <div className={styles.shotTableContainer}>
        <table className={styles.shotTable}>
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className={selectedRowIds[row.id] ? styles.activeCell : ""}
                    onClick={() =>
                      setSelectedRowIds(
                        cell.id === row.id ? {} : { [row.id]: true },
                      )
                    }
                  >
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
};

export default ClubBreakdownWidget;
