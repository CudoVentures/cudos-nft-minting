import { ThemeProvider } from '@material-ui/core';
import Database from '../../utilities/database/Database';
import RepoFactory from '../../utilities/database/RepoFactory';
import NftService from '../NftService';

export default class ServicesFactory {

    db: Database;
    repoFactory: RepoFactory;

    nftService: NftService;

    constructor(db: Database) {
        this.db = db;
        this.repoFactory = new RepoFactory(db);

        this.nftService = new NftService();
    }

    getNftService(): NftService {
        return this.nftService ?? new NftService();
    }

}
