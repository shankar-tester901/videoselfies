module.exports = (event, context) => {
	/* 
        EVENT FUNCTIONALITIES
    */
	// const DATA = event.data; //event data
	// const TIME = event.time; //event occured time

	// const SOURCE_DETAILS = event.getSourceDetails(); //event source details
	// const SOURCE_ACTION = SOURCE_DETAILS.action; //(insert | fetch | invoke ...)
	// const SOURCE_TYPE = SOURCE_DETAILS.type; //(datastore | cache | queue ...)
	// const SOURCE_ENTITY_ID = SOURCE_DETAILS.entityId; //if type is datastore then entity id is tableid

	// const SOURCE_BUS_DETAILS = SOURCE_DETAILS.getBusDetails(); //event bus details
	// const SOURCE_BUS_ID = SOURCE_BUS_DETAILS.id; //event bus id

	// const PROJECT_DETAILS = event.getProjectDetails(); //event project details
	// const FUNCTION_DETAILS = event.getFunctionDetails(); //event function details

	console.log('Hello from index.js');

	/* 
        CONTEXT FUNCTIONALITIES
    */
	context.closeWithSuccess(); //end of application with success
	// context.closeWithFailure(); //end of application with failure
};
