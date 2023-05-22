// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

/* Autogenerated file. Do not edit manually. */

import { Direction } from "./../Types.sol";

interface ICharacterSystem {
  function spawn(int32 x, int32 y) external;

  function move(Direction direction) external;
}