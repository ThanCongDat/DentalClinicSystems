/* eslint-disable react-refresh/only-export-components */
/* eslint-disable @typescript-eslint/no-unused-vars */
// Lightweight mock for Ant Design — avoids CSS-in-JS overhead in tests
import React from 'react';

const passthrough = (name: string) => {
  const C = ({ children, ...rest }: Record<string, unknown>) =>
    React.createElement('div', { 'data-testid': name, ...rest }, children as React.ReactNode);
  C.displayName = name;
  return C;
};

export const Table = ({ dataSource, columns, loading, rowKey }: {
  dataSource?: Record<string, unknown>[];
  columns?: { title: string; dataIndex?: string; render?: (v: unknown, r: unknown) => React.ReactNode }[];
  loading?: boolean;
  rowKey?: string;
}) => (
  <div data-testid="table">
    {loading && <div data-testid="loading">Loading...</div>}
    {(dataSource ?? []).map((row, i) => (
      <div key={rowKey ? String(row[rowKey]) : i} data-testid="table-row">
        {columns?.map((col) => (
          <span key={col.title} data-testid={`col-${col.dataIndex ?? col.title}`}>
            {col.render
              ? col.render(col.dataIndex ? row[col.dataIndex] : undefined, row)
              : col.dataIndex
              ? String(row[col.dataIndex] ?? '')
              : null}
          </span>
        ))}
      </div>
    ))}
  </div>
);

export const Button = ({
  children,
  onClick,
  type: _type,
  icon,
  size: _size,
  danger: _danger,
  disabled,
  ...rest
}: Record<string, unknown>) =>
  React.createElement('button', { onClick, disabled, ...rest }, icon, children);

export const Modal = ({ open, children, title, onOk, onCancel }: {
  open?: boolean; children?: React.ReactNode; title?: string;
  onOk?: () => void; onCancel?: () => void;
}) => open ? (
  <div data-testid="modal">
    <div data-testid="modal-title">{title}</div>
    {children}
    <button onClick={onOk}>OK</button>
    <button onClick={onCancel}>Cancel</button>
  </div>
) : null;

export const Drawer = ({ open, children, title, onClose, extra }: {
  open?: boolean; children?: React.ReactNode; title?: React.ReactNode;
  onClose?: () => void; extra?: React.ReactNode;
}) => open ? (
  <div data-testid="drawer">
    <div data-testid="drawer-title">{title}</div>
    <button data-testid="drawer-close" onClick={onClose}>Close</button>
    {extra}
    {children}
  </div>
) : null;

export const Form = Object.assign(
  ({ children, onFinish }: { children?: React.ReactNode; onFinish?: (v: unknown) => void }) => (
    <form onSubmit={(e) => { e.preventDefault(); onFinish?.({}); }}>{children}</form>
  ),
  {
    Item: ({ children, label }: { children?: React.ReactNode; label?: string }) => (
      <div>
        {label && <label>{label}</label>}
        {children}
      </div>
    ),
    List: ({ children }: { children?: React.ReactNode }) => <div>{children}</div>,
    useForm: () => [{ submit: () => {}, resetFields: () => {} }],
  }
);

export const Input = Object.assign(
  ({ onChange, placeholder, value }: Record<string, unknown>) =>
    React.createElement('input', { onChange, placeholder, value }),
  {
    TextArea: ({ onChange, placeholder }: Record<string, unknown>) =>
      React.createElement('textarea', { onChange, placeholder }),
  }
);

export const InputNumber = ({ onChange, placeholder, value, min, style }: Record<string, unknown>) =>
  React.createElement('input', {
    type: 'number',
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => onChange?.(Number(e.target.value) || undefined),
    placeholder: String(placeholder ?? ''),
    value: value as number,
    min: min as number,
    style,
  });

export const Select = ({ options, onChange, placeholder }: Record<string, unknown>) => (
  <select onChange={(e) => (onChange as ((v: string) => void))?.(e.target.value)}>
    <option value="">{String(placeholder ?? 'Select')}</option>
    {(options as { value: string; label: string }[] ?? []).map((o) => (
      <option key={o.value} value={o.value}>{o.label}</option>
    ))}
  </select>
);

export const Space = passthrough('Space');
export const Typography = { Title: passthrough('Title') };
export const Alert = ({ message, type }: { message?: string; type?: string }) =>
  <div data-testid={`alert-${type}`}>{message}</div>;
export const Descriptions = Object.assign(
  passthrough('Descriptions'),
  {
    Item: ({ children, label }: { children?: React.ReactNode; label?: string }) =>
      <div><span>{label}</span><span>{children}</span></div>,
  }
);
export const Tabs = ({ items }: { items?: { key: string; label: string; children?: React.ReactNode }[] }) => (
  <div data-testid="tabs">
    {items?.map((tab) => <div key={tab.key} data-testid={`tab-${tab.key}`}>{tab.children}</div>)}
  </div>
);
export const Tag = passthrough('Tag');
export const Badge = ({ count }: { count?: number }) => <span data-testid="badge">{count}</span>;
export const message = { success: () => {}, error: () => {}, warning: () => {} };

// Icon stubs — used by @ant-design/icons alias
export const PlusOutlined     = () => null;
export const EyeOutlined      = () => null;
export const FileTextOutlined = () => null;
export const SearchOutlined   = () => null;
export const UserOutlined     = () => null;
export const EditOutlined     = () => null;
export const DeleteOutlined   = () => null;
export const CheckOutlined    = () => null;
export const CloseOutlined    = () => null;
export const DownloadOutlined = () => null;
