import React, { useEffect, useState } from "react";
import { Select, SelectProps } from "@material-tailwind/react";

const AsyncSelect = React.forwardRef((props, ref) => {
  const [key, setKey] = useState("");

  useEffect(() => setKey(crypto.randomUUID()), [props]);

  return <Select key={key} ref={ref} {...props} />;
});

AsyncSelect.displayName = "AsyncSelect";

export default AsyncSelect;
