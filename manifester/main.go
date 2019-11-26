package main

import (
	"crypto/sha256"
	"encoding/json"
	"fmt"
	"io"
	"io/ioutil"
	"log"
	"os"
	"path/filepath"
)

type manifest struct {
	Name  string `json:"name"`
	Hash  string `json:"hash"`
	S3Key string `json:"s3key"`
}

func main() {
	var output string = os.Args[1]
	dir := filepath.Dir(output)
	files := os.Args[2:]
	count := len(files)
	hashes := make([]manifest, count)
	hasher := sha256.New()
	for i, file := range files {
		f, err := os.Open(file)
		if err != nil {
			log.Fatal(err)
		}
		defer f.Close()

		out, err := ioutil.TempFile(dir, "manifest-temp-*.zip")
		outWriter := io.MultiWriter(out, hasher)

		if _, err := io.Copy(outWriter, f); err != nil {
			log.Fatalf("Error copying zip to output file: %s\n", err)
		}

		hash := fmt.Sprintf("%x", hasher.Sum(nil))
		s3key := fmt.Sprintf("%s.zip", hash)
		outputName := filepath.Join(dir, s3key)

		if err := os.Rename(out.Name(), outputName); err != nil {
			log.Fatalf("Error moving %s to %s: %s", out.Name(), outputName, err)
		}
		hashes[i] = manifest{Name: file, Hash: hash, S3Key: s3key}
		hasher.Reset()
	}
	j, err := json.MarshalIndent(hashes, "", "  ")

	if err != nil {
		fmt.Printf("Error generating manifest: %s\n", err.Error())
	}

	err = ioutil.WriteFile(output, j, 0644)
	if err != nil {
		fmt.Printf("Error writing manifest to file: %s\n", err.Error())
	}
}
