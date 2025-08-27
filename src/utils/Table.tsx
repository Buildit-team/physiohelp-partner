import React, { useState, type Key } from 'react';
import { ChevronUp, ChevronDown, Pencil, Trash2, Eye, Search, Calendar, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { format, isWithinInterval, parseISO } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import type { DataItemT, ImageWithTextConfig, TablePropsT, DateRange, ButtonPropsT } from '../interface/addProduct';



const ImageWithTextCell = <T extends DataItemT>({
  item,
  config
}: {
  item: T;
  config: ImageWithTextConfig;
}) => {
  const [imageError, setImageError] = useState(false);

  let imageSrc: string | undefined;
  const imageValue = item[config.imageKey];

  if (Array.isArray(imageValue) && imageValue.length > 0) {
    imageSrc = imageValue[0]?.image_url;
  } else if (typeof imageValue === 'object' && imageValue !== null) {
    imageSrc = imageValue.image_url;
  } else {
    imageSrc = config.imageConfig?.fallbackSrc;
  }

  return (
    <div className="flex items-center gap-3">
      <span className='w-[40%] flex justify-end'>
        <img
          src={
            imageError && config.imageConfig?.fallbackSrc
              ? config.imageConfig.fallbackSrc
              : (imageSrc as string)
          }
          alt={String(item[config.textKey])}
          className={`object-cover rounded-md flex justify-center ${config.imageConfig?.className || ''}`}
          style={{
            width: config.imageConfig?.width || '50px',
            height: config.imageConfig?.height || '50px',
          }}
          onError={() => setImageError(true)}
        />
      </span>
      <span className="font-small text-[12px] text-gray-900 text-right w-[60%] flex justify-start text-wrap">{item[config.textKey]}</span>
    </div>
  );
};

const Table = <T extends DataItemT>({
  data = [],
  columns = [],
  actions,
  className = '',
  searchPlaceholder = 'Search...',
  buttons = [],
  filterOptions = [],
  filterKey,
  dateFilterKey,
  itemsPerPage = 10,
  currentPage: controlledCurrentPage,
  totalItems: controlledTotalItems,
  onPageChange,
  rowUrl = () => '',
  isLoading = false,
  emptyStateMessage = '',
}: TablePropsT<T>) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [date, setDate] = useState<DateRange>({ from: undefined, to: undefined });
  const [sortConfig, setSortConfig] = useState<{
    key: keyof T | null;
    direction: 'asc' | 'desc';
  }>({
    key: null,
    direction: 'asc',
  });
  const [internalCurrentPage, setInternalCurrentPage] = useState(1);
  const currentPage = controlledCurrentPage || internalCurrentPage;


  const handleSort = (key: keyof T) => {
    setSortConfig({
      key,
      direction:
        sortConfig.key === key && sortConfig.direction === 'asc'
          ? 'desc'
          : 'asc',
    });
  };

  const handleRowClick = (item: T) => {
    const url = rowUrl(item);
    if (url) {
      navigate(url);
    }
  };

  const LoadingState = () => (
    <div className="w-full flex flex-col gap-[20px]">
      <div className="flex flex-col gap-4 max-[650px]:mt-[40px]">
        <div className="flex flex-col md:flex-row md:items-center gap-4 w-full">
          <div className="relative flex-grow w-full md:w-[50%]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-100"
              disabled
            />
          </div>
          <div className="flex gap-2 w-full md:w-[30%] justify-end">
            {buttons.map((button, index) => (
              <button
                key={index}
                disabled
                className="px-4 py-2 rounded-md text-sm font-medium bg-gray-200 text-gray-400 cursor-not-allowed"
              >
                {button.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="w-full flex justify-center items-center py-16">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 text-blue-500 animate-spin" />
          <p className="text-gray-500 text-lg">Loading data...</p>
        </div>
      </div>
    </div>
  );

  const EmptyState = () => (
    <div className="w-full flex flex-col gap-[20px]">
      <div className="flex flex-col gap-4 max-[650px]:mt-[40px]">
        <div className="flex flex-col md:flex-row md:items-center gap-4 w-full">
          <div className="relative flex-grow w-full md:w-[50%]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-100"
            />
          </div>
          <div className="flex gap-2 w-full md:w-[30%] justify-end">
            {buttons.map((button, index) => (
              <button
                key={index}
                onClick={button.onClick}
                className="px-4 py-2 rounded-md text-sm font-medium bg-blue-600 text-white hover:bg-blue-700"
              >
                {button.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="w-full flex flex-col justify-center items-center py-48 text-center">
        <div className="bg-gray-100 rounded-full p-6 mb-4">
          <Search className="h-12 w-12 text-gray-500" />
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">{emptyStateMessage}</h3>
      </div>
    </div>
  );
  const filteredData = React.useMemo(() => {
    let filtered = data;


    if (searchQuery) {
      filtered = filtered.filter((item) =>
        columns.some((column) => {
          if (column.searchable) {
            if (column.isImageWithText && column.imageWithTextConfig) {
              return String(item[column.imageWithTextConfig.textKey])
                .toLowerCase()
                .includes(searchQuery.toLowerCase());
            }
            return String(item[column.key])
              .toLowerCase()
              .includes(searchQuery.toLowerCase());
          }
          return false;
        })
      );
    }

    if (filterKey && activeFilter !== 'all') {
      filtered = filtered.filter(
        (item) =>
          String(item[filterKey]).toLowerCase() === activeFilter.toLowerCase()
      );
    }

    if (dateFilterKey && date.from && date.to) {
      filtered = filtered.filter((item) => {
        const itemDate = parseISO(item[dateFilterKey]);
        return isWithinInterval(itemDate, { start: date.from!, end: date.to! });
      });
    }

    return filtered;
  }, [data, searchQuery, filterKey, activeFilter, dateFilterKey, date.from, date.to, columns]);

  const sortedData = React.useMemo(() => {
    if (!sortConfig.key) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aValue = a[sortConfig.key!];
      const bValue = b[sortConfig.key!];

      if (aValue == null && bValue == null) return 0;
      if (aValue == null) return sortConfig.direction === 'asc' ? -1 : 1;
      if (bValue == null) return sortConfig.direction === 'asc' ? 1 : -1;

      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortConfig]);


  const actualTotalItems = controlledTotalItems !== undefined ? controlledTotalItems : sortedData.length;
  const totalPages = Math.ceil(actualTotalItems / itemsPerPage);

  const paginatedData = controlledTotalItems !== undefined ?
    sortedData :
    sortedData?.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePageChange = (page: number) => {
    if (onPageChange) {
      onPageChange(page);
    } else {
      setInternalCurrentPage(page);
    }
  };

  const TableButton = ({ label, onClick, variant = 'primary' }: ButtonPropsT) => {
    const baseStyles = "px-4 py-2 rounded-md text-sm font-medium transition-colors";
    const variantStyles = {
      primary: "bg-blue-600 text-white hover:bg-blue-700",
      secondary: "bg-gray-600 text-white hover:bg-gray-700",
      outline: "border border-gray-300 text-gray-700 hover:bg-gray-50"
    };

    return (
      <button
        onClick={onClick}
        className={`${baseStyles} ${variantStyles[variant]}`}
      >
        {label}
      </button>
    );
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (!data || data.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="w-full flex flex-col gap-[20px]">
      <div className="flex flex-col gap-4 max-[650px]:mt-[40px]">
        <div className="flex flex-col md:flex-row md:items-center gap-4 w-full">
          <div className="relative flex-grow w-full md:w-[50%]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-100"
            />
          </div>
          <div className="flex gap-2 w-full md:w-[30%] justify-end">
            {buttons.map((button, index) => (
              <TableButton key={index} {...button} />
            ))}
          </div>
        </div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {filterOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setActiveFilter(option.value)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeFilter === option.value
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
              >
                {option.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <div className="flex items-center gap-2">
              <input
                type="date"
                className="px-3 py-2 border rounded-md text-sm"
                onChange={(e) => setDate((prev) => ({ ...prev, from: e.target.value ? new Date(e.target.value) : undefined }))}
              />
              <span className="text-gray-500">to</span>
              <input
                type="date"
                className="px-3 py-2 border rounded-md text-sm"
                onChange={(e) => setDate((prev) => ({ ...prev, to: e.target.value ? new Date(e.target.value) : undefined }))}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="hidden md:block w-full overflow-x-auto">
        <table className={`min-w-full divide-y divide-gray-200 ${className}`}>
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column, index) => (
                <th
                  key={`${String(column.key)}-${index}`}
                  className="px-6 py-3 text-left text-sm font-medium text-gray-500 tracking-wider cursor-pointer "
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div className="flex items-center gap-2">
                    {column.header}
                    {column.sortable && (
                      <div className="flex flex-col">
                        <ChevronUp
                          className={`h-3 w-3 ${sortConfig.key === column.key &&
                            sortConfig.direction === 'asc'
                            ? 'text-blue-600'
                            : 'text-gray-400'
                            }`}
                        />
                        <ChevronDown
                          className={`h-3 w-3 ${sortConfig.key === column.key &&
                            sortConfig.direction === 'desc'
                            ? 'text-blue-600'
                            : 'text-gray-400'
                            }`}
                        />
                      </div>
                    )}
                  </div>
                </th>
              ))}
              {actions && <th className="px-6 py-3">Actions</th>}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedData.map((item: T, rowIndex: Key | null | undefined) => (
              <tr key={rowIndex} >
                {columns.map((column, colIndex) => (
                  <td
                    key={`${String(column.key)}-${rowIndex}-${colIndex}`}
                    className="px-6 py-4 whitespace-wrap  text-sm text-gray-500 cursor-pointer"
                    onClick={() => handleRowClick(item)}
                  >
                    {column.isImageWithText && column.imageWithTextConfig ? (
                      <ImageWithTextCell
                        item={item}
                        config={column.imageWithTextConfig}
                      />
                    ) : column.render ? (
                      column.render(item[column.key], item)
                    ) : typeof item[column.key] === 'string' && !isNaN(Date.parse(item[column.key])) ? (
                      format(new Date(item[column.key]), 'yyyy-MM-dd')
                    ) : (
                      item[column.key]
                    )}
                  </td>
                ))}
                {actions && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex gap-2">
                      {actions.onView && (
                        <button
                          onClick={() => actions.onView?.(item)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                      )}
                      {actions.onEdit && (
                        <button
                          onClick={() => actions.onEdit?.(item)}
                          className="text-green-600 hover:text-green-900"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                      )}
                      {actions.onDelete && (
                        <button
                          onClick={() => actions.onDelete?.(item)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                      {actions.onAssign && actions.showAssign && actions.showAssign(item) && (
                        <button
                          onClick={() => actions.onAssign?.(item)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <p>{actions.assignText}</p>
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Card-Based Layout for Mobile */}
      <div className="md:hidden w-full">
        {paginatedData.map((item, rowIndex) => (
          <div key={rowIndex} className="bg-white p-4 rounded-lg shadow-md mb-4"
          >
            {columns.map((column, colIndex) => (
              <div key={`${String(column.key)}-${rowIndex}-${colIndex}`} className="mb-3 flex justify-between"
                onClick={() => handleRowClick(item)}
              >
                <div className="text-sm font-medium text-gray-500">{column.header}</div>
                <div className="text-sm text-gray-700"
                >
                  {column.isImageWithText && column.imageWithTextConfig ? (
                    <ImageWithTextCell
                      item={item}
                      config={column.imageWithTextConfig}
                    />
                  ) : column.render ? (
                    column.render(item[column.key], item)
                  ) : typeof item[column.key] === 'string' && !isNaN(Date.parse(item[column.key])) ? (
                    format(new Date(item[column.key]), 'yyyy-MM-dd')
                  ) : (
                    item[column.key]
                  )}
                </div>
              </div>
            ))}
            {actions && (
              <div className="flex gap-2 mt-3">
                {actions.onView && (
                  <button
                    onClick={() => actions.onView?.(item)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                )}
                {actions.onEdit && (
                  <button
                    onClick={() => actions.onEdit?.(item)}
                    className="text-green-600 hover:text-green-900"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                )}
                {actions.onDelete && (
                  <button
                    onClick={() => actions.onDelete?.(item)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
                {actions.onAssign && actions.showAssign && actions.showAssign(item) && (
                  <button
                    onClick={() => actions.onAssign?.(item)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <p>{actions.assignText}</p>
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="flex flex-col md:flex-row items-center justify-between mt-4 gap-4">
        <div className="text-sm text-gray-500">
          Showing {actualTotalItems > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to {Math.min(currentPage * itemsPerPage, actualTotalItems)} of {actualTotalItems} entries
        </div>
        <div className="flex gap-2 items-center">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 text-gray-700 bg-gray-100 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="text-sm text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={paginatedData.length < itemsPerPage}
            className="p-2 text-gray-700 bg-gray-100 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Table;