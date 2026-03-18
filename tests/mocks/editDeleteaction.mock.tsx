const MockEditDeleteAction = ({ type }: { type: string; idemId: string }) => {
  return (
    <>
      <button type="button">Edit {type}</button>
      <button type="button">Delete {type}</button>
    </>
  );
};

export { MockEditDeleteAction };
