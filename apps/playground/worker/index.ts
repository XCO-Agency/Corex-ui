import { handleRequest, type WorkerEnv } from "./routing";

export default {
  fetch(request: Request, env: WorkerEnv): Promise<Response> {
    return handleRequest(request, env);
  },
};
