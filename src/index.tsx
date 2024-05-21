import * as React from 'react';
import "./style.css";


export interface ColumnHeader {
	sortKey: string
	title: string
	type?: string
	default?: boolean
	sort?: (a: any, b: any) => number
	enableSort?: boolean
}

interface HeaderCellProps {
	columnHeader: ColumnHeader
	sorting: { column: ColumnHeader, order: string }
	onSort: (sorting: { column: ColumnHeader, order: string }) => void
}

interface SortProps {
	column: ColumnHeader
	order: string
}

interface HeaderProps {
	columns: ColumnHeader[]
	sorting: { column: ColumnHeader, order: string }
	onSort: (sorting: SortProps) => void
}

interface ContentProps {
	entries: any[]
	columns: ColumnHeader[]
	pagesCutCount?: number
	enablePagination?: boolean
}

const HeaderCell = ({ columnHeader, sorting, onSort }: HeaderCellProps) => {
	const isDescSorting =
		columnHeader.enableSort && sorting.column && sorting.column.sortKey === columnHeader.sortKey && sorting.order === "desc";
	const isAscSorting =
		columnHeader.enableSort && sorting.column && sorting.column.sortKey === columnHeader.sortKey && sorting.order === "asc";

	return (
		// biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
		<th
			key={columnHeader.sortKey}
			className='hrnet-table__thead__th'
			onClick={() => columnHeader.enableSort && onSort({ column: columnHeader, order: isAscSorting ? "desc" : "asc" })}
		>
			{columnHeader.title}
			{isDescSorting && <span className="hrnet-table__thead__sorting">▼</span>}
			{isAscSorting && <span className="hrnet-table__thead__sorting">▲</span>}
		</th>
	);
};

const Header = ({ columns, sorting, onSort }: HeaderProps) => {
	return (
		<thead className="hrnet-table__thead">
			<tr className='hrnet-table__thead__tr'>
				{columns.map((column: any) => (
					<HeaderCell
						key={column.sortKey}
						columnHeader={column}
						sorting={sorting}
						onSort={onSort}
					/>
				))}
			</tr>
		</thead>
	);
};

const Content = ({ entries, columns }: ContentProps) => {
	return (
		<tbody className="hrnet-table__body">
			{entries.map((entry, index) => (
				<tr key={`table-content-${index}`}
					className='hrnet-table__body__tr'
				>
					{columns.map((column) => (
						<td 
						className="hrnet-table__body__td"
						key={column.sortKey}

						>{entry[column.sortKey] ?? ""}
						</td>
					))}
				</tr>
			))}
		</tbody>
	);
};

const SearchTable = ({ searchFilter }:any) => {
	const [searchValue, setSearchValue] = React.useState('')
	const submitForm = (e: { preventDefault: () => void; }) => {
		e.preventDefault();
		searchFilter(searchValue)
	}
	const resetForm = () => {
		setSearchValue('');
		searchFilter('');
	  }
	return (
		<div className="hrnet-table__searchbar">
			<form className="hrnet-table__searchbar__form" onSubmit={submitForm}>
				<input
				className="hrnet-table__searchbar__input"
					type="text"
					placeholder="Search..."
					value={searchValue}
					onChange={(e) => setSearchValue(e.target.value)}
				/>
				<button className="hrnet-table__searchbar__button" type="submit">Search</button>
				<button className="hrnet-table__searchbar__button" type="button" onClick={resetForm}>Reset</button>
			</form>
		</div>
	)
}
// #region ---- Début Section Pagination ----
const range = (start: number, end: number) => {
	return [...Array(end - start).keys()].map((el) => el + start)
}

const getPagesCut = ({ pagesCount, pagesCutCount, currentPage }: { pagesCount: number, pagesCutCount: number, currentPage: number }) => {
	const ceiling = Math.ceil(pagesCutCount / 2)
	const floor = Math.floor(pagesCutCount / 2)
	const page_0 = Math.max(currentPage - floor, 1);
	const page_1 = Math.min(currentPage + ceiling, pagesCount + 1);
	if (page_1 - page_0 < pagesCutCount) {
		if (page_0 < ceiling) {
			return { start: 1, end: Math.min(pagesCutCount + 1, pagesCount + 1) };
		}
		if (page_1 > pagesCount - floor) {
			return { start: Math.max(pagesCount - pagesCutCount, 1), end: pagesCount + 1 };
		}
	}
	return { start: page_0, end: page_1 };

}

const PaginationItem = ({ textPage,page, currentPage, onPageChange, isDisabled = false }: { textPage?:string,page: number, currentPage: number, onPageChange: (page: number) => void, isDisabled?: boolean }) => {
	const isActive = currentPage === page;
	const className = isActive ? "hrnet-table__pagination__link--is-active hrnet-table__pagination__li" : "hrnet-table__pagination__link hrnet-table__pagination__li";
	return (
		<li className={className} onClick={() => !isDisabled && !isActive && onPageChange(page)}>
			<span className="hrnet-table__pagination__span">{textPage ?? page}</span>
		</li>
	)
}

export const Pagination = ({ currentPage, total, limit, onPageChange, onLimitChange, pagesCutCount = 5 }: { currentPage: number, total: number, limit: number, onPageChange: (page: number) => void, onLimitChange: (limit: number) => void, pagesCutCount?: number }) => {
	limit = limit || total;
	currentPage = limit === total ? 1 : currentPage;
	const pagesCount = Math.ceil(total / limit);
	const pagesCut = getPagesCut({ pagesCount, pagesCutCount, currentPage });
	const pages = range(pagesCut.start, pagesCut.end);
	const isFirstPage = currentPage === 1;
	const isLastPage = currentPage === pagesCount;
	const firstEntryIndex = (currentPage - 1) * limit + 1;
	const lastEntryIndex = Math.min(currentPage * limit, total);

	const handleLimitChange = (event: React.FormEvent<HTMLSelectElement>) => {
		onLimitChange(Number(event.currentTarget.value));
	};
	return (
		<div className="hrnet-table__footer">
			<div className="hrnet-table__footer__show">
				<p>Show entries {firstEntryIndex}-{lastEntryIndex} of {total}</p>
			</div>
			<div className="hrnet-table__pagination__select">
				<select onChange={handleLimitChange} value={limit} className="hrnet-table__select">
					<option value="5">5</option>
					<option value="10">10</option>
					<option value="20">20</option>
					<option value="50">50</option>
					<option value="100">100</option>
					<option value="0">all</option>

				</select>
				<div>
				<ul className="hrnet-table__pagination__ul">
					{currentPage > pagesCutCount - Math.floor(pagesCutCount / 2) && (
						<>
							<PaginationItem
								textPage="First"
								page={1}
								currentPage={currentPage}
								onPageChange={() => onPageChange(1)}
								isDisabled={isFirstPage} />
							<PaginationItem
								textPage="Prev"
								page={1}
								currentPage={currentPage}
								onPageChange={() => onPageChange(currentPage - 1)}
								isDisabled={isFirstPage} />
						</>
					)}
					{pages.map((page) => (
						<PaginationItem
							page={page}
							key={page}
							currentPage={currentPage}
							onPageChange={onPageChange}
						/>
					))}
					{(currentPage < pagesCount - Math.floor(pagesCutCount / 2)) && (
						<>
							<PaginationItem
								textPage="Next"
								page={1}
								currentPage={currentPage}
								onPageChange={() => onPageChange(currentPage + 1)}
								isDisabled={isLastPage}
							/>
							<PaginationItem
								textPage="Last"
								page={1}
								currentPage={currentPage}
								onPageChange={() => onPageChange(pagesCount)}
								isDisabled={isLastPage}
							/>
						</>
					)}

				</ul>
				</div>
				
			</div>
		</div>
	);

}
// #endregion ---- Fin Section Pagination ----

const Table = ({ columns, entries, pagesCutCount = 5, enablePagination = true }: ContentProps) => {
	const [sorting, setSorting] = React.useState<SortProps>({ column: (columns.find(c => c.default === true) || columns[0]), order: "asc" })
	const [searchValue, setSearchValue] = React.useState("");
	const [currentPage, setCurrentPage] = React.useState(1);
	const [entriesPerPage, setEntriesPerPage] = React.useState(enablePagination ? 20 : 0);
	const [filteredEntries, setFilteredEntries] = React.useState<any[]>(entries);
	const [currentEntries, setEntries] = React.useState<any[]>(entries)


	const currentColumns: ColumnHeader[] = columns.map((column) => {
		return {
			...column,
			enableSort: column.enableSort === undefined ? true : column.enableSort
		};
	})

	const handlePageChange = (newPage: number) => {
		setCurrentPage(newPage);
	}
	const handleLimitChange = (newLimit: number) => {
		setEntriesPerPage(newLimit);
		setCurrentPage(1);
	}
	const handleSort = (newSorting: SortProps) => {
		setSorting(newSorting);
	};
	const handleSearch = (newSearchValue: string) => {
		setSearchValue(newSearchValue);
	};

	React.useEffect(() => {
		if (!sorting.column) return;
		const order = sorting.order === "asc" ? 1 : -1;
		const sortKey = sorting.column.sortKey;
		const type = sorting.column.type || "string";
		const sortFunction = sorting.column.sort || ((a: string | number | Date, b: string | number | Date) => {
			if (type === "string") {
				return (a as string).toLowerCase().localeCompare((b as string).toLowerCase())
			}
			if (type === "number") {
				return (a as number) - (b as number);
			}
			if (type === "date") {
				return new Date((a as Date)).getTime() - new Date((b as Date)).getTime();
			}
			return (a as string).toLowerCase().localeCompare((b as string).toLowerCase())
		});

		let updatedEntries = [...entries];

		if (searchValue) {
			const lowerSearchValue = searchValue.toLowerCase()
			updatedEntries = updatedEntries.filter((row) =>
				Object.values(row).some((value) =>
					(['string', 'number'].includes(typeof value)) && (value as any).toString().toLowerCase().includes(lowerSearchValue)
				)
			);
		}

		updatedEntries.sort((a, b) => {
			if (a[sortKey] === undefined || b[sortKey] === undefined) {
				return ((a[sortKey] === undefined ? 1 : 0) + (b[sortKey] === undefined ? -1 : 0))
			}
			return order * sortFunction(a[sortKey], b[sortKey]);
		});

		setFilteredEntries(updatedEntries);
	}, [sorting, entries, searchValue]);

	React.useEffect(() => {
		if (entriesPerPage < 1) {
			setEntries(filteredEntries);
		} else {
			const indexOfLastEntry = currentPage * entriesPerPage;
			const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
			setEntries(filteredEntries.slice(indexOfFirstEntry, indexOfLastEntry));
		}
	}, [currentPage, entriesPerPage, filteredEntries]);

	return (
		<div className="hrnet-table__container">
			<SearchTable searchFilter={handleSearch} />
			<table className="hrnet-table__main" >
				<Header columns={currentColumns} sorting={sorting} onSort={handleSort} />
				<Content entries={currentEntries} columns={currentColumns} />
			</table>
			{enablePagination && <Pagination
				currentPage={currentPage}
				total={filteredEntries.length}
				limit={entriesPerPage}
				onPageChange={handlePageChange}
				onLimitChange={handleLimitChange}
				pagesCutCount={pagesCutCount}
			/>}
		</div>
	);
};

export default Table;


