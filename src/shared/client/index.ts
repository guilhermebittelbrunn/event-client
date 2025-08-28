import ClientBase, { ClientConfigWeb } from './base';

export class Client extends ClientBase {
    constructor(config: ClientConfigWeb) {
        super(config);
    }
}
