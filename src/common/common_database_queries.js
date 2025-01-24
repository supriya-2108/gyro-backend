const createRecord = async (Model, recordObj) => {
    const result = await Model.create(recordObj);
    return {
      status: true,
      data: result,
    };
  };
  
  const createBulkRecords = async (Model, recordArrayObj) => {
    const result = await Model.insertMany(recordArrayObj);
    return {
      status: true,
      data: result,
    };
  };
  
  const getAllRecord = async (Model, condObj, projectObj, sortObj) => {
    // extract limit and skip from sortObj
    let limit = sortObj.limit ? sortObj.limit : 0;
    let skip = sortObj.skip ? sortObj.skip : 0;
    delete sortObj.limit;
    delete sortObj.skip;
  
    // create the query with conditions, projection, and sorting
    let query = Model.find(condObj, projectObj).sort(sortObj);
  
    // apply limit and skip to the query
    if (limit) {
      query = query.limit(limit);
    }
    if (skip) {
      query = query.skip(skip);
    }
  
   
    const result = await query;
  
    if (result && result.length > 0) {
      return {
        status: true,
        data: result,
        message: "Record Found",
      };
    } else {
      return {
        status: false,
        data: [],
        message: "No Record Found",
      };
    }
  };
  
  const getRecord = async (Model, condObj, projectObj) => {
    const result = await Model.findOne(condObj, projectObj);
    if (result) {
      return {
        status: true,
        data: result,
        message: "Record Found",
      };
    } else {
      return {
        status: false,
        data: [],
        message: "No Record Found",
      };
    }
  };
  
  const getAllRecordPopulated = async (Model, query) => {
    const { condObj, projectObj, sortObj, populateConfig } = query;
  
    // extract limit and skip from sortObj
    let limit = sortObj.limit ? sortObj.limit : 0;
    let skip = sortObj.skip ? sortObj.skip : 0;
    delete sortObj.limit;
    delete sortObj.skip;
  
    // create the query with conditions, projection, and population
    let findQuery = Model.find(condObj, projectObj).populate(populateConfig);
  
    // apply limit and skip to the query
    if (limit) {
      findQuery = findQuery.limit(limit);
    }
    if (skip) {
      findQuery = findQuery.skip(skip);
    }
  
    // apply sorting to the query
    findQuery = findQuery.sort(sortObj);
  
    // execute the query
    const result = await findQuery;
  
    if (result && result.length > 0) {
      return {
        status: true,
        data: result,
        message: "Record Found",
      };
    } else {
      return {
        status: false,
        data: [],
        message: "No Record Found",
      };
    }
  };
  
  const getAllRecordPopulatedPaged = async (Model, query) => {
    const { condObj, projectObj, sortObj, populateConfig } = query;
  
    // extract limit and page from sortObj
    let limit = sortObj.limit ? sortObj.limit : 10;
    let page = sortObj.page ? sortObj.page : 1;
    delete sortObj.limit;
    delete sortObj.page;
  
    // calculate skip based on page and limit
    let skip = (page - 1) * limit;
  
    // create the query with conditions, projection, and population
    let findQuery = Model.find(condObj, projectObj).populate(populateConfig);
  
    // apply limit and skip to the query
    if (limit) {
      findQuery = findQuery.limit(limit);
    }
    if (skip) {
      findQuery = findQuery.skip(skip);
    }
  
    // apply sorting to the query
    findQuery = findQuery.sort(sortObj);
  
    // execute the query and get total count
    const result = await findQuery;
    const total_records = await Model.countDocuments(condObj);
  
    // calculate pagination details
    const fetched_records = result.length;
    const current_page = page;
    const per_page = limit;
    const total_pages = Math.ceil(total_records / limit);
  
    if (fetched_records > 0) {
      return {
        status: true,
        data: result,
        total_records,
        current_page,
        per_page,
        total_pages,
        message: "Record Found",
      };
    } else {
      return {
        status: false,
        data: [],
        total_records,
        current_page,
        per_page,
        total_pages,
        message: "No Record Found",
      };
    }
  };
  
  const getSingleRecordPopulated = async (Model, query) => {
    const { condObj, projectObj, populateConfig } = query;
    console.log("populateConfig", query);
    const result = await Model.findOne(condObj, projectObj).populate(
      populateConfig
    );
    if (result) {
      return {
        status: true,
        data: result,
        message: "Record Found",
      };
    } else {
      return {
        status: false,
        data: [],
        message: "No Record Found",
      };
    }
  };
  
  const updateRecord = async (Model, condObj, updateObj) => {
    const result = await Model.updateOne(condObj, updateObj);
    if (result.modifiedCount > 0) {
      return {
        status: true,
        data: result,
        message: "Record Updated",
      };
    } else {
      return {
        status: false,
        data: [],
        message: "No Record Found",
      };
    }
  };
  
  const updateBulkRecords = async (Model, condObj, updateObj) => {
    let { date } = getTimestamps();
    const result = await Model.updateMany(condObj, updateObj);
    if (result.modifiedCount > 0) {
      return {
        status: true,
        data: result,
      };
    } else {
      return {
        status: false,
        data: [],
        message: "No Record Found",
      };
    }
  };
  
  const countRecords = async (Model, condObj) => {
    const result = await Model.countDocuments(condObj);
    return {
      status: true,
      data: result,
      message: "Record Found",
    };
  };
  
  const aggregateRecordFunction = async (Model, aggregateArrayObj) => {
    const result = await Model.aggregate(aggregateArrayObj);
    return {
      status: true,
      data: result,
    };
  };
  
  const deleteRecord = async (Model, condObj) => {
    const result = await Model.deleteOne(condObj);
    if (result.deletedCount > 0) {
      return {
        status: true,
        data: result,
        message: "Record Deleted",
      };
    } else {
      return {
        status: false,
        data: [],
        message: "No Record Found",
      };
    }
  };
  
  // Get Multiple Records by IDs
  const getRecordsByIds = async (Model, idsArray, projectObj) => {
    const result = await Model.find({ _id: { $in: idsArray } }, projectObj);
    return {
      status: true,
      data: [],
      data: result,
    };
  };
  
  // Delete Multiple Records by IDs
  const deleteRecordsByIds = async (Model, idsArray) => {
    const result = await Model.deleteMany({ _id: { $in: idsArray } });
    if (result.deletedCount > 0) {
      return {
        status: true,
        data: result,
        message: "Records Deleted",
      };
    } else {
      return {
        status: false,
        data: [],
        message: "No Records Found",
      };
    }
  };
  
export {
    createRecord,
    createBulkRecords,
    getAllRecord,
    getRecord,
    getAllRecordPopulated,
    getAllRecordPopulatedPaged,
    getSingleRecordPopulated,
    updateRecord,
    updateBulkRecords,
    aggregateRecordFunction,
    deleteRecord,
    countRecords,
    getRecordsByIds,
    deleteRecordsByIds,
};
  