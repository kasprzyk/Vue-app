var mixin = {
  methods: {
    async getDictionaryProper() {
      this.loading = true;
      var params = {
        page: {
          size: this.pagination.itemsPerPage,
          number: this.pagination.page
        },
        sort: {
          fieldName:
            this.pagination.sortBy && this.pagination.sortBy.length
              ? this.pagination.sortBy[0]
              : "",
          direction:
            this.pagination.sortDesc && this.pagination.sortDesc[0]
              ? "DESC"
              : "ASC"
        },
        filters: this.prepareFilters(),
        dictionaryName: this.dictionaryName
      };
      try {
        var data = await this.sendAjaxWithParams(
          this.ajaxUrls.dictionaryByFilterSearch,
          params
        );
        this.items = data.results.items;
        this.total = data.total;
      } catch (e) {
        console.log("error");
      }
      this.loading = false;
    },
    async getDictionary() {
      clearTimeout(this.getDictionaryImmediateID);
      this.getDictionaryImmediateID = setTimeout(
        () => this.getDictionaryProper(),
        300
      );
    },
    prepareFilters() {
      var filters = [];
      if (this.search) {
        var copySearch = JSON.parse(JSON.stringify(this.search));
        for (var searchKey in copySearch) {
          var searchItem = copySearch[searchKey];
          if (searchItem.valueList && searchItem.valueList.length > 0) {
            var newValueList = searchItem.valueList.map(el => {
              if (el != null) {
                el = el.toString();
              }
              return el;
            });
            searchItem.valueList = newValueList;
            filters.push(searchItem);
          }
        }
      }
      return filters;
    }
  },
  data: () => ({
    loading: true,
    getDictionaryImmediateID: false,
    pagination: {},
    items: [],
    total: 0,
    rowsPerPage: [5]
  })
};

export default mixin;
