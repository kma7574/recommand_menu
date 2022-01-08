import { call, put, takeEvery } from "redux-saga/effects";
import { getGraphDataAPI } from "../api/graphData";
import { reducerUtils } from "../lib/reducerUtil";

const GET_GRAPH_DATA = "graphData/GET_GRAPH_DATA";
const GET_GRAPH_DATA_SUCCESS = "graphData/GET_GRAPH_DATA_SUCCESS";
const GET_GRAPH_DATA_ERROR = "graphData/GET_GRAPH_DATA_ERROR";

export const getGraphData = (type, startDate, endDate) => ({
  type: GET_GRAPH_DATA,
  payload: {
    type,
    startDate,
    endDate,
  },
});

function* getGraphDataSaga(action) {
  const { type, startDate, endDate } = action.payload;
  try {
    const payload = yield call(getGraphDataAPI, type, startDate, endDate);
    const label = payload.patients.map((patient) => patient.date);
    const patient = payload.patients.map((patient) => patient.patient_count);
    const deliver = payload.deliveries.map((deliver) => deliver.deliver_count);
    yield put({
      type: GET_GRAPH_DATA_SUCCESS,
      payload: { label, patient, deliver },
    });
  } catch (e) {
    yield put({ type: GET_GRAPH_DATA_ERROR, error: e });
  }
}

export function* graphDataSaga() {
  yield takeEvery(GET_GRAPH_DATA, getGraphDataSaga);
}

const initialState = reducerUtils.initial();

export default function graphData(state = initialState, action) {
  switch (action.type) {
    case GET_GRAPH_DATA:
      return reducerUtils.loading();
    case GET_GRAPH_DATA_SUCCESS:
      return reducerUtils.success(action.payload);
    case GET_GRAPH_DATA_ERROR:
      return reducerUtils.error(action.error);
    default:
      return state;
  }
}
