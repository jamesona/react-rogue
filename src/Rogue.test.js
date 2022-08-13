import React from "react";
import { render } from "@testing-library/react";
import Rogue from "./Rogue";

test("renders learn react link", () => {
  const { getByText } = render(<Rogue width={40} height={40} tilesize={20} />);
});
