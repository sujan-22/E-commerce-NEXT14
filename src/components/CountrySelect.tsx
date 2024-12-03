"use client";

import { Listbox, Transition } from "@headlessui/react";
import { Fragment, useEffect, useMemo, useState } from "react";
import ReactCountryFlag from "react-country-flag";

import { useParams, usePathname } from "next/navigation";
import { Countries, Country } from "@/data/countries";
import { useUpdateRegion } from "@/data/country/utils";
import useStore from "@/context/useStore";
type CountryOption = {
    label: string;
    route: string;
};

type CountrySelectProps = {
    toggleState: {
        state: boolean;
        close: () => void;
    };
};

const CountrySelect = ({ toggleState }: CountrySelectProps) => {
    const [current, setCurrent] = useState<CountryOption | undefined>();
    const setCountry = useStore((state) => state.setCountry);
    const updateRegion = useUpdateRegion();

    const pathname = usePathname(); // Get the full current path
    const { countryCode } = useParams(); // Extract the current countryCode
    const { state, close } = toggleState;

    const options = useMemo(() => {
        return Countries.map((c) => ({
            label: c.label,
            route: c.route,
        }));
    }, []);

    useEffect(() => {
        if (countryCode) {
            const option = options.find((o) => o.route === countryCode);
            setCurrent(option);
        }
    }, [options, countryCode]);

    const handleChange = (option: CountryOption) => {
        updateRegion(option.route, pathname);
        close();
        setCountry(option.route);
    };

    return (
        <div>
            <Listbox
                as="span"
                onChange={handleChange}
                defaultValue={options.find((o) => o.route === countryCode)}
            >
                <Listbox.Button className="py-1 w-full">
                    <div className="txt-compact-small flex items-start gap-x-2">
                        <span>Shipping to:</span>
                        {current && (
                            <span className="txt-compact-small flex items-center gap-x-2">
                                <ReactCountryFlag
                                    svg
                                    style={{
                                        width: "16px",
                                        height: "16px",
                                    }}
                                    countryCode={current.route.toUpperCase()}
                                />
                                {current.label}
                            </span>
                        )}
                    </div>
                </Listbox.Button>
                <div className="flex relative w-full min-w-[320px]">
                    <Transition
                        show={state}
                        as={Fragment}
                        leave="transition ease-in duration-150"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <Listbox.Options
                            className="absolute -bottom-[calc(100%-36px)] left-0 sm:left-auto sm:right-0 max-h-[442px] overflow-y-scroll z-[900] bg-white drop-shadow-md text-md uppercase text-black overflow-auto scrollbar-hide rounded-md w-full"
                            static
                        >
                            {options.map((o, index) => (
                                <Listbox.Option
                                    key={index}
                                    value={o}
                                    className="py-2 hover:bg-gray-200 px-3 cursor-pointer flex items-center gap-x-2"
                                >
                                    <ReactCountryFlag
                                        svg
                                        style={{
                                            width: "16px",
                                            height: "16px",
                                        }}
                                        countryCode={o.route.toUpperCase()}
                                    />
                                    {o.label}
                                </Listbox.Option>
                            ))}
                        </Listbox.Options>
                    </Transition>
                </div>
            </Listbox>
        </div>
    );
};

export default CountrySelect;
