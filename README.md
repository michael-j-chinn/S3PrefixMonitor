# S3PrefixMonitor

The purpose of this program is to track files in S3 buckets. This is useful when using S3 as a queue.

## Configuration

You need to tell the program which buckets and folders you want to track. To do that, you need a file at the root level called "jobs.json" that has the following content:

{
    "jobs": [
        {
            "filename": "file_where_data_stored.tsv",
            "regions": ["us-east-1", "us-west-2"],
            "buckets": ["bucketToMatchRegion1", "bucketToMatchRegion1"],
            "prefix": "folder/path/where/files/are"
        },
        {
            "filename": "second_file_where_data_stored.tsv",
            "regions": ["us-east-1", "us-west-2"],
            "buckets": ["bucketToMatchRegion1", "bucketToMatchRegion1"],
            "prefix": "second/folder/path/where/files/are"
        }
    ]
}