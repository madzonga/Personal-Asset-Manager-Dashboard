// src/database/database.schema.ts

import { AssetTable } from "../assets/assets.model";
import { AssetDailyPriceTable } from "../price/price.model";
import { UserTable } from "../user/user.model";


export interface Database {
  users: UserTable;
  assets: AssetTable;
  asset_daily_prices: AssetDailyPriceTable;
}