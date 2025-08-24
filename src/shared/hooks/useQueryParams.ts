class QueryParamHandler {
    private searchParams() {
        return new URLSearchParams(window.location.search);
    }

    private mergeParams(url: string, params: string) {
        if (!params) {
            return url;
        }

        return `${url}?${params}`;
    }

    private updateUrl(searchParam: URLSearchParams) {
        const newParams = searchParam.toString();

        window.history.pushState(null, '', this.mergeParams(this.completeUrl, newParams));
    }

    get completeUrl(): string {
        return `${window.location.protocol}//${window.location.host}${window.location.pathname}`;
    }

    set(name: string, value: string): void {
        const params = this.searchParams();

        params.set(name, value);

        this.updateUrl(params);
    }

    get(name: string): string | null {
        return this.searchParams().get(name);
    }

    delete(name: string) {
        const params = this.searchParams();

        params.delete(name);

        this.updateUrl(params);
    }
}

function useQueryParams() {
    return new QueryParamHandler();
}

export default useQueryParams;
