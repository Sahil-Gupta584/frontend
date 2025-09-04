function Flag({ countryCode }: { countryCode: string }) {
  return (
    <img
      className="h-[12px] w-[18px] "
      src={`https://purecatamphetamine.github.io/country-flag-icons/3x2/${countryCode}.svg`}
    />
  );
}

export default Flag;
