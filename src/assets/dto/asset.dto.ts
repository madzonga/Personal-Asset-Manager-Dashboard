// src/assets/dto/asset.dto.ts

import { ApiProperty } from '@nestjs/swagger';

export class AssetDto {
  @ApiProperty({ example: 1, description: 'Unique identifier of the asset' })
    id!: number;

  @ApiProperty({ example: 1000, description: 'Foreign key reference to the user who owns this asset' })
    user_id!: number;

  @ApiProperty({ example: 'Bitcoin', description: 'Name of the asset' })
    name!: string;

  @ApiProperty({ example: 'ERC-20', description: 'Type of the asset, either ERC-20 or ERC-721' })
    type!: 'ERC-20' | 'ERC-721';

  @ApiProperty({ example: '0x1234...', description: 'Smart contract address of the asset' })
    smart_contract_address!: string;

  @ApiProperty({ example: 'Ethereum', description: 'Blockchain network where the asset is held' })
    chain!: string;

  @ApiProperty({ example: 100, description: 'Quantity of the asset, nullable for ERC-721 tokens', nullable: true })
    quantity!: number | null;

  @ApiProperty({ example: '1', description: 'Token ID for ERC-721 assets, nullable for ERC-20 tokens', nullable: true })
    token_id!: string | null;

  @ApiProperty({ example: new Date().toISOString(), description: 'Date when the asset was created' })
    created_at!: string;

  @ApiProperty({ example: 1000, description: 'Cost basis of the asset' })
    cost_basis!: number;
}