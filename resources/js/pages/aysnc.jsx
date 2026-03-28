    // const handleDownload = async () => {
     
    //     await document.fonts.ready;
    //     let originalClassName = textContainerRef.current?.className || "";
    //     try {
    //         if (textContainerRef.current) {
    //             textContainerRef.current.className = originalClassName.replace(
    //                 /border-2 border-dotted border-white/,
    //                 ""
    //             );
    //         }
    //         const dataUrl = await toPng(previewRef.current, {
    //             cacheBust: true,
    //             pixelRatio: 2,
    //         });
    //         if (textContainerRef.current)
    //             textContainerRef.current.className = originalClassName;

    //         const link = document.createElement("a");
    //         link.download = `custom-${currentSide}.png`;
    //         link.href = dataUrl;
    //         link.click();
    //     } catch (error) {
    //         if (textContainerRef.current)
    //             textContainerRef.current.className = originalClassName;
    //         toast.error("Download failed");
    //     }
    // };


        // const openPreview = async () => {
    //     await document.fonts.ready;
    //     if (!product?.customization?.[currentSide + "_image"]) {
    //         toast.error(`No ${currentSide} image available.`);
    //         return;
    //     }
    //     setIsPreviewOpen(true);
    // };