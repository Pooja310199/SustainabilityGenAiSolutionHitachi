


const onAdvanceSearch = useCallback(async (formData) => {


  await onBasicSearch(formData);

  if (abortRef.current) abortRef.current.abort();

  abortRef.current = new AbortController();

  const {
    selectedCountries = [],
    suppliers = [],
    customers = [],
    consortiumPartner = "",
    projectName,
    territoryName,
  } = formData;


  setHasSearched(true);
  setViewMode("advanced");
  setLoading(true);

  try {
    const updates = {};

    if (selectedCountries.length > 0) {

      const advanced = await Promise.all(
        selectedCountries.map((c) =>
          fetchCountryAdvance(c, "advanced")
        ),
      );


      updates.countryAdvanced = {
        macro: "Country",
        mode: "Advanced",
        selectedCountries,
        data: advanced,
      };

    } else {

      updates.countryAdvanced = null;
    }
    // -------- PARTNER --------

    const allPartnerNames = [
      ...suppliers,
      ...customers,
      consortiumPartner,
    ]
      .map((n) => n?.trim())
      .filter(Boolean);

    if (allPartnerNames.length > 0) {
      setLoadingMap((p) => ({ ...p, customer: true }));
      setResultsMap((prev) => ({
        ...prev,

        customerAdvanced: {
          macro: "Partner",
          mode: "Advanced",
          suppliers,
          customers,
          consortiumPartner,

          data: new Array(allPartnerNames.length).fill(null), // important
        },
      }));

      let completed = 0;
      const total = allPartnerNames.length;
      let index = 0;

      async function worker() {




        while (index < allPartnerNames.length) {
          const currentIndex = index++;
          const name = allPartnerNames[currentIndex];
          try {


            const data = await fetchCustomerAdvance(name);
            setResultsMap((prev) => {

              const newData = [
                ...(prev.customerAdvanced?.data || [])
              ];

              newData[currentIndex] = data;

              return {
                ...prev,

                customerAdvanced: {
                  ...prev.customerAdvanced,
                  data: newData,
                },
              };
            });


          } finally {
            completed++;
            if (completed === total) {
              setLoadingMap((p) => ({
                ...p,
                customer: false,
              }));
            }

          }

        }
      }
      Array.from({ length: 4 }, worker);


    } else {
      updates.customerAdvanced = null;

    }

    // merge only updated slots → untouched slots keep their reference
    setResultsMap((prev) => ({
      ...prev,
      ...updates,
    }));

  } catch (error) {
    console.error("Advanced search failed", error);


  } finally {
    setLoading(false);
  }




}, []);